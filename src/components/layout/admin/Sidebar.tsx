"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Coins,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  // {
  //   section: "overview",
  //   items: [
  //     { icon: LayoutDashboard, label: "대시보드", href: "/admin/dashboard" },
  //   ],
  // },
  {
    section: "management",
    items: [
      { icon: Building2, label: "고객사 관리", href: "/admin/clients" },
      { icon: Coins, label: "크레딧 관리", href: "/admin/credits" },
      { icon: Users, label: "관리자", href: "/admin/users" },
    ],
  },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="w-[220px] min-h-screen bg-surface border-r border-border fixed top-0 left-0 bottom-0 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
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
        </Link>
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
              const itemWithBadge = item as typeof item & { badge?: string };
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
                  {itemWithBadge.badge && (
                    <span className="ml-auto bg-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                      {itemWithBadge.badge}
                    </span>
                  )}
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
