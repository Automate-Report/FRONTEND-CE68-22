import { ReactNode } from "react";

interface WorkerLayoutProps {
    children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps){
    return (
        <main className="flex-1">
            {children}
        </main>
 
    );
}