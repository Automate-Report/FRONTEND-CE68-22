import Link from "next/link";

export default function ProfilePage(){


    return (
        <div>
            <Link href="/profile/edit">
                <button  className="bg-[#F1F1F1] text-[#0F0F0F] cursor-pointer">
                    12
                </button>
            </Link>
        </div>
    );
}