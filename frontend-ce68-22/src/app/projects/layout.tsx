import { ReactNode } from "react";

interface ProjectLayoutProps {
    children: ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps){
    return (
        <div className="flex min-h-screen">
            <main className="flex-1 relative">
                {children}
            </main>
        </div>
        
    );
}