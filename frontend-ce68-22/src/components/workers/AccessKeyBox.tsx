"use client";

import { Worker } from "@/src/types/worker";

interface WorkerItemProps {
  worker: Worker;
}

export function AccessKeyBox({ worker }: WorkerItemProps)
{
    return (
        <div>
            {worker.name}
        </div>
    );
}