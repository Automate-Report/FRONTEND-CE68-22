import { ReactNode } from "react";

interface WorkerLayoutProps {
    children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps){
    return (
        <div className="flex h-fit">
            <main className="flex-1">
                {children}
            </main>
        </div>
        
    );
}