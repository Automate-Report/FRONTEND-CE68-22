import { ReactNode } from "react";

interface WorkerLayoutProps {
    children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps){
    return (
        <div className="flex min-h-full w-full bg-transparent scrollbar-hide">
            <main className="flex-1">
                {children}
            </main>
        </div>
        
    );
}