import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function  AuthLayout({ children }: AuthLayoutProps){
    return (
        <main className="overflow-hidden">
            {children}
        </main>
    );
}