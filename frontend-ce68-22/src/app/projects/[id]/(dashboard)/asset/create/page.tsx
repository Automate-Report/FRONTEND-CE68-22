"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { 
  Box, 
  Typography, 
  TextField, 
  Button,  
  Link as MuiLink 
} from "@mui/material";

import { GenericBreadcrums } from "@/src/components/Common/GenericBreadCrums";

export default function CreateProjectPage() {
  const breadcrumbItems = [
        { label: "Home", href: "/main"},
        { label: "{Project Name}" , href: undefined},
        { label: "Asset" , href: undefined},
        { label: "Create new asset" , href: undefined}
    ];

  return (
    <div className="">
        <GenericBreadcrums items={breadcrumbItems} />
        <div className="text-[#E6F0E6] gap-3">
            <div className="text-[24px] font-bold text-[#E6F0E6]">Asset Name</div>
            <div>Box</div>
        </div>

        <div className="text-[#E6F0E6] my-6 gap-3">
            <div className="text-[24px] font-bold text-[#E6F0E6]">Asset</div>
            <div>Box</div>
        </div>

        <div className="text-[#E6F0E6] gap-4">
            <div className="text-[24px] font-bold text-[#E6F0E6]">Credentials</div>
            <div>Credential Table</div>
            <div>Add New Credentials Button</div>
        </div>
        <div className="text-[#E6F0E6] flex gap-6 pt-4 mt-4">
            <div>Cancel</div>
            <div>Create Asset</div>
        </div>
         
    </div>
  );
}