"use client";

import { useAuthStore } from "@/store/useAuthStore";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function ManagerTopNav({ title, subtitle }: TopNavProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-7">
      {/* Left: Title */}
      <div>
        <h1 className="text-lg font-semibold text-text">{title}</h1>
        {subtitle && <p className="text-xs text-text-3 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-4">
        {/* 고객사명 */}
        <span className="text-sm font-semibold text-text">{user?.workplaceName}</span>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <div className="text-sm font-medium text-text">{user?.name}</div>
            <div className="text-xs text-text-3">{user?.job}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center">
            <span className="text-accent font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
