import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps){
    return (
        <div className="flex h-dvh overflow-hidden">
            <main className="flex-1 overflow-y-auto relative pb-30">
                {children}
            </main>
        </div>
        
    );
}