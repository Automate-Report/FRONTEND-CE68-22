
import Link from "next/link";
import { GREEN_BUTTON_STYLE } from "@/src/styles/greenButton";

interface GenericGreenButton{
    name: string;
    href: string;
    icon?: React.ReactNode | null;
}

export function GenericGreenButton({name, href, icon}: GenericGreenButton)
{
    return (
        <Link href={href}>
            <button className={GREEN_BUTTON_STYLE}>
                <p className="hidden lg:block">{name}</p>
                {icon}
            </button>
        </Link>
    );
}