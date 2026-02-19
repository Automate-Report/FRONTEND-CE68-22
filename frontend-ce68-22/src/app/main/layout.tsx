import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps){
    return (
        <div className="flex h-fit">
            <main className="flex-1 relative mx-30">
                {children}
            </main>
        </div>
        
    );
}