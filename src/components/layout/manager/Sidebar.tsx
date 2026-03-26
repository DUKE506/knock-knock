"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  CreditCard,
  Coins,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  // {
  //   section: "overview",
  //   items: [
  //     { icon: LayoutDashboard, label: "대시보드", href: "/manager/dashboard" },
  //   ],
  // },
  {
    section: "management",
    items: [
      {
        icon: ClipboardCheck,
        label: "카드 발급 관리",
        href: "/manager/card-requests",
      },
      { icon: Users, label: "담당자 관리", href: "/manager/users" },
      { icon: Coins, label: "크레딧 관리", href: "/manager/credits" },
      { icon: CreditCard, label: "카드 디자인", href: "/manager/card-design" },
    ],
  },
  {
    section: "etc",
    items: [{ icon: Settings, label: "설정", href: "/manager/settings" }],
  },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-[220px] min-h-screen bg-surface border-r border-border fixed top-0 left-0 bottom-0 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <Link href="/manager/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center text-[13px] font-semibold text-white tracking-tight">
            KK
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-text">
              knock-knock
            </div>
            <div className="text-[10px] text-text-3 font-mono mt-0.5 tracking-wide uppercase">
              Manager
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="py-3 flex-1 overflow-y-auto">
        {menuItems.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <div className="px-3 pt-2 pb-0.5 text-[10px] text-text-3 font-mono tracking-wider uppercase mt-2">
              {section.section}
            </div>
            {section.items.map((item, itemIdx) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`
                    flex items-center gap-2.5 px-5 py-2.5 text-[13px] cursor-pointer
                    transition-all duration-150 border-l-2
                    ${
                      isActive
                        ? "text-accent bg-accent-dim border-l-accent"
                        : "text-text-2 border-l-transparent hover:text-text hover:bg-accent-dim"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-5 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-0 py-0 text-[13px] text-text-2 hover:text-text transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
