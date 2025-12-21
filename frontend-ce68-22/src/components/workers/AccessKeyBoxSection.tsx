"use client";

import { useState } from "react";


import { Worker } from "@/src/types/worker";


interface WorkerItemProps {
  worker: Worker;
}

export function AccessKeyBox({ worker }: WorkerItemProps)
{


    return (
        <div className="pt-3">
            {worker.access_key_id === null ? (
                <div>not have access key</div>
            ) : (
                <div>have access key</div>
            )}
        </div>
    );
}