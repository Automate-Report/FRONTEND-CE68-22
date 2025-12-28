import { redirect } from "next/navigation";
import { use } from "react";

export default function ProjectRootPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // สั่ง Redirect ทันทีที่เข้ามาหน้านี้
  redirect(`/projects/${id}/overview`);
}