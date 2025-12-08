
import Link from "next/link";

interface GenericGreenButton{
    name: string;
    href: string;
    icon?: React.ReactNode | null;
}

export function GenericGreenButton({name, href, icon}: GenericGreenButton)
{
    return (
        <Link href={href}>
            <button className="flex items-center justify-center bg-[#8FFF9C] text-[#0B0F12] text-[16px] font-semibold rounded-lg shadow-sm px-6 py-2 gap-3 cursor-pointer">
                {name}
                {icon}
            </button>
        </Link>
    );
}