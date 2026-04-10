"use client";

import { Sidebar, TopNav } from "@/components/layout/admin";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

// URL → Title 매핑
const PAGE_CONFIG: Record<string, { title: string; subtitle?: string }> = {
  "/admin/dashboard": { title: "대시보드" },
  "/admin/clients": { title: "고객사 관리" },
  "/admin/issue-codes": { title: "발급코드 관리" },
  "/admin/requests": { title: "발급 요청 현황" },
  "/admin/credits": { title: "크레딧 관리" },
  "/admin/users": { title: "관리자 계정" },
  "/admin/logs": { title: "시스템 로그" },
  "/admin/settings": { title: "설정" },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageConfig = PAGE_CONFIG[pathname] || { title: "Admin" };

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 ml-[220px] flex flex-col">
        <TopNav title={pageConfig.title} subtitle={pageConfig.subtitle} />
        <div className="p-7 flex-1">{children}</div>
      </main>
      {/* <Toaster position="top-right" richColors /> */}
    </div>
  );
}
