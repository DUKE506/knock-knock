"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function TopNav({ title, subtitle }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString =
        now.toLocaleDateString("ko-KR") +
        " " +
        now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-14 bg-surface border-b border-border flex items-center px-7 gap-4 sticky top-0 z-10">
      <div className="flex-1">
        <div className="text-[15px] font-semibold text-text">{title}</div>
        {subtitle && (
          <div className="text-xs text-text-3 mt-0.5">{subtitle}</div>
        )}
      </div>
      <span className="text-xs text-text-3 font-mono">{currentTime}</span>
      {/* User Info */}
      <div className="flex items-center gap-3 pl-4 border-l border-border">
        <div className="text-right">
          <div className="text-sm font-medium text-text">{user?.name}</div>
          <div className="text-xs text-text-3">{user?.workplaceName}</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center">
          <span className="text-accent font-semibold text-sm">
            {user?.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
