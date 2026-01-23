import { ReactNode } from "react";

interface ProjectLayoutProps {
    children: ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps){
    return (
        <div className="flex h-dvh overflow-hidden">
            <main className="flex-1 overflow-y-auto relative pb-30">
                {children}
            </main>
        </div>
        
    );
}