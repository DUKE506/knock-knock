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
  {
    section: "개요",
    items: [
      { icon: LayoutDashboard, label: "대시보드", href: "/manager/dashboard" },
    ],
  },
  {
    section: "관리",
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
    section: "기타",
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
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border">
        <Link href="/manager/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">KK</span>
          </div>
          <span className="font-semibold text-text">Knock-Knock</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-5 mb-2">
              <span className="text-xs font-medium text-text-3 uppercase tracking-wider">
                {section.section}
              </span>
            </div>
            <ul className="space-y-1 px-3">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-accent-dim text-accent font-medium"
                          : "text-text-2 hover:text-text hover:bg-bg"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-2 hover:text-text hover:bg-bg transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
