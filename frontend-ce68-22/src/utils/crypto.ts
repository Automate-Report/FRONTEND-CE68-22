const KEY_STRING = process.env.NEXT_PUBLIC_AES_KEY!;

async function getKey(): Promise<CryptoKey> {
    const encoded = new TextEncoder().encode(KEY_STRING).slice(0, 32);
    return crypto.subtle.importKey(
        "raw", encoded, { name: "AES-CBC" }, false, ["encrypt"]
    );
}

export async function encryptPassword(password: string): Promise<string> {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encoded = new TextEncoder().encode(password);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv }, key, encoded
    );

    // Pack iv + ciphertext together, send as base64
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);

    return btoa(String.fromCharCode(...combined));
}