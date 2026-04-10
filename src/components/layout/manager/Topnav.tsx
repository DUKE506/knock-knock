"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function ManagerTopNav({ title, subtitle }: TopNavProps) {
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
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-7">
      {/* Left: Title */}
      <div>
        <h1 className="text-lg font-semibold text-text">{title}</h1>
        {subtitle && <p className="text-xs text-text-3 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-4">
        {/* Time */}
        <div className="text-xs text-text-3 font-mono">{currentTime}</div>

        {/* Notification Bell */}
        {/* <button className="relative p-2 hover:bg-bg rounded-md transition-colors">
          <Bell className="w-5 h-5 text-text-2" />
          
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full"></span>
        </button> */}

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
    </header>
  );
}
