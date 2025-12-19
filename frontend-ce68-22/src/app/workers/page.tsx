"use client";

import { useState } from "react";
import { WorkerList } from "@/src/components/workers/WorkerList";
import CreateWorkerIcon from "@/src/components/icon/CreateWorker";
import { GenericGreenButton } from "@/src/components/Common/GenericGreenButton";


export default function ProjectsPage() {

  return (
    <div className="mx-auto w-11/12 bg-[#0F1518]">
      <div className="flex justify-between items-center text-4xl text-[#E6F0E6] font-bold pb-10">
        Worker
        {/* ปุ่ม New Worker */}
        < GenericGreenButton
          name="New Worker"
          href="/main"
          icon={<CreateWorkerIcon />}
        />
      </div>
        
      <WorkerList/>
    </div>
  );
}
