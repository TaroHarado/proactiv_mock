"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TaskInboxRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/manager/tasks");
  }, [router]);
  return (
    <div className="flex items-center justify-center p-8 text-[#64748b]">
      Перенаправление в очередь задач…
    </div>
  );
}
