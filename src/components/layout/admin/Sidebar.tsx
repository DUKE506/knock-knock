"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Key,
  ClipboardList,
  Coins,
  Users,
  ScrollText,
  Settings,
} from "lucide-react";

const navItems = [
  {
    section: "Overview",
    items: [
      { icon: LayoutDashboard, label: "대시보드", href: "/admin/dashboard" },
    ],
  },
  {
    section: "Management",
    items: [
      { icon: Key, label: "사업장 관리", href: "/admin/workplaces" },
      // { icon: Key, label: "발급코드 관리", href: "/admin/issue-codes" },
      {
        icon: ClipboardList,
        label: "발급 요청 현황",
        href: "/admin/requests",
        badge: 7,
      },
      { icon: Coins, label: "크레딧 관리", href: "/admin/credits" },
    ],
  },
  {
    section: "System",
    items: [
      { icon: Users, label: "관리자 계정", href: "/admin/managers" },
      { icon: ScrollText, label: "시스템 로그", href: "/admin/logs" },
      { icon: Settings, label: "설정", href: "/admin/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] min-h-screen bg-surface border-r border-border fixed top-0 left-0 bottom-0 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center text-[13px] font-semibold text-white tracking-tight">
            KK
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-text">
              knock-knock
            </div>
            <div className="text-[10px] text-text-3 font-mono mt-0.5 tracking-wide uppercase">
              Super Admin
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-3 flex-1 overflow-y-auto">
        {navItems.map((section, sectionIdx) => (
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
                  {item.badge && (
                    <span className="ml-auto bg-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border text-xs text-text-3">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-md bg-accent-dim border border-accent flex items-center justify-center text-[11px] text-accent font-semibold">
            SA
          </div>
          <div>
            <div className="text-xs text-text-2 font-medium">슈퍼 관리자</div>
            <div className="text-[10px] text-text-3 font-mono">superadmin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
