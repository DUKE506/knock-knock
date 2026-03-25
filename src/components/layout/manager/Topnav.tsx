"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function ManagerTopNav({ title, subtitle }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [userName, setUserName] = useState("");
  const [workplaceName, setWorkplaceName] = useState("");

  useEffect(() => {
    // 사용자 정보 가져오기
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.email);
        // TODO: workplace 정보 가져오기
        setWorkplaceName("사업장명"); // 임시
      } catch (error) {
        console.error("사용자 정보 파싱 실패:", error);
      }
    }

    // 현재 시간 업데이트
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 1분마다 업데이트

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
        <button className="relative p-2 hover:bg-bg rounded-md transition-colors">
          <Bell className="w-5 h-5 text-text-2" />
          {/* Badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <div className="text-sm font-medium text-text">{userName}</div>
            <div className="text-xs text-text-3">{workplaceName}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent-dim flex items-center justify-center">
            <span className="text-accent font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
