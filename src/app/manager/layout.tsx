"use client";

import { Sidebar, TopNav } from "@/components/layout/manager";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

// URL → Title 매핑
const PAGE_CONFIG: Record<string, { title: string; subtitle?: string }> = {
  "/manager/dashboard": { title: "대시보드" },
  "/manager/card-requests": {
    title: "카드 발급 관리",
    subtitle: "승인/거부 관리",
  },
  "/manager/users": { title: "담당자 관리", subtitle: "사업장 담당자 목록" },
  "/manager/credits": {
    title: "크레딧 관리",
    subtitle: "잔여 크레딧 확인 및 충전",
  },
  "/manager/card-design": { title: "카드 디자인", subtitle: "템플릿 설정" },
  "/manager/settings": { title: "설정", subtitle: "사업장 정보 관리" },
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageConfig = PAGE_CONFIG[pathname] || { title: "Manager" };

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 ml-[220px] flex flex-col">
        <TopNav title={pageConfig.title} subtitle={pageConfig.subtitle} />
        <div className="p-7 flex-1">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
