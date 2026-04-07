import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose"

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    let isTokenValid = false;
    if (token) {
        try {
            const payload = decodeJwt(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (payload.exp && payload.exp > currentTime) {
                isTokenValid = true;
            }
        } catch (e) {
            isTokenValid = false;
        }
    }


    // user NOT logged in and trying to access protected page
    if (!isTokenValid && !publicRoutes.includes(pathname)) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.set("access_token", "", { 
        expires: new Date(0),  // force expire
        path: "/"
    });
        return response;
    }

    // user logged in but trying to access public page
    if (isTokenValid && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/main", request.url));
    }

    const response = NextResponse.next();

    // Set custom header to show NavBar only in Protected page
    if (isTokenValid && !publicRoutes.includes(pathname)) {
        response.headers.set("x-show-navbar", "true");
    }
    else {
        response.headers.set("x-show-navbar", "false");
    }


    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};