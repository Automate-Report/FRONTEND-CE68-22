import { ReactNode } from "react";

interface WorkerLayoutProps {
    children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps){
    return (
        <div className="flex h-dvh overflow-hidden">
            <main className="flex-1 overflow-y-auto pb-30">
                {children}
            </main>
        </div>
        
    );
}