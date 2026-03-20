import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps){
    return (
        <div className="flex h-fit py-4">
            <main className="flex-1 relative mx-[10vw]">
                {children}
            </main>
        </div>
        
    );
}