"use client";

import { useState, useEffect } from "react";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function TopNav({ title, subtitle }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState("");

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
    </div>
  );
}
