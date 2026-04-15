"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Calendar,
  User,
  Pencil,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import Switch from "@/components/common/Switch";
import EditSiteNameModal from "@/components/manager/settings/EditSiteNameModal";
import EditQrTimeoutModal from "@/components/manager/settings/EditQrTimeoutModal";
import { fetchSiteDetail, updateAutoIssue } from "@/lib/api/manager/site";
import { useAuthStore } from "@/store/useAuthStore";

interface SettingRowProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
}

function SettingRow({ label, icon, children, onEdit }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-2 min-w-[140px]">
        {icon && <span className="text-text-3">{icon}</span>}
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <div className="flex items-center gap-3 flex-1 justify-end">
        {children}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="w-7 h-7 rounded-md border border-border-2 bg-transparent
                       text-text-3 hover:text-text hover:border-accent hover:bg-accent-dim
                       transition-all duration-150 flex items-center justify-center shrink-0"
            title="수정"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const siteKey = useAuthStore((s) => s.user?.workplaceId ?? "");

  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState({
    siteName: "",
    managerEmail: "",
    createdAt: "",
    autoIssue: false,
    qrTimeout: 30,
  });

  const [autoIssueLoading, setAutoIssueLoading] = useState(false);
  const [editSiteNameOpen, setEditSiteNameOpen] = useState(false);
  const [editQrTimeoutOpen, setEditQrTimeoutOpen] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchSiteDetail();
    if (error || !data) {
      toast.error("사업장 정보를 불러오지 못했습니다.");
      setIsLoading(false);
      return;
    }
    setSiteData({
      siteName: data.siteName,
      managerEmail: "",   // GetSiteDetail 미제공 — 추후 연동
      createdAt: "",      // GetSiteDetail 미제공 — 추후 연동
      autoIssue: data.autoIssue ?? false,
      qrTimeout: data.qrTimeout ?? 30,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAutoIssueToggle = async (next: boolean) => {
    setAutoIssueLoading(true);
    const prev = siteData.autoIssue;
    setSiteData((d) => ({ ...d, autoIssue: next }));     // optimistic update

    const { error } = await updateAutoIssue(siteKey, next);
    if (error) {
      setSiteData((d) => ({ ...d, autoIssue: prev }));   // rollback
      toast.error("자동 승인 설정 변경에 실패했습니다.");
    } else {
      toast.success(`자동 승인이 ${next ? "활성화" : "비활성화"}되었습니다.`);
    }
    setAutoIssueLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-semibold text-text">설정</h1>
        <p className="text-sm text-text-3 mt-1">사업장 정보 및 운영 설정 관리</p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* 사업장 정보 카드 */}
        <div className="bg-surface border border-border rounded-lg px-6 py-2">
          <div className="flex items-center gap-2 py-4 mb-1 border-b border-border">
            <div className="w-10 h-10 rounded-md bg-accent-dim flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">사업장 정보</h2>
              <p className="text-xs text-text-3">사업장 기본 정보를 관리합니다</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-text-3">불러오는 중...</div>
          ) : (
            <>
              <SettingRow
                label="사업장 이름"
                icon={<Building2 className="w-4 h-4" />}
                onEdit={() => setEditSiteNameOpen(true)}
              >
                <span className="text-sm text-text">{siteData.siteName || "—"}</span>
              </SettingRow>

              <SettingRow
                label="주관리자"
                icon={<User className="w-4 h-4" />}
              >
                <span className="text-sm text-text-3">{siteData.managerEmail || "—"}</span>
              </SettingRow>

              <SettingRow
                label="생성일"
                icon={<Calendar className="w-4 h-4" />}
              >
                <span className="text-sm text-text-3 font-mono">{siteData.createdAt || "—"}</span>
              </SettingRow>
            </>
          )}
        </div>

        {/* 운영 설정 카드 */}
        <div className="bg-surface border border-border rounded-lg px-6 py-2">
          <div className="flex items-center gap-2 py-4 mb-1 border-b border-border">
            <div className="w-10 h-10 rounded-md bg-accent-dim flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">운영 설정</h2>
              <p className="text-xs text-text-3">카드 발급 및 QR 관련 설정을 관리합니다</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-text-3">불러오는 중...</div>
          ) : (
            <>
              <SettingRow
                label="자동 승인"
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                <span className={`text-xs font-medium ${siteData.autoIssue ? "text-green" : "text-text-3"}`}>
                  {siteData.autoIssue ? "활성" : "비활성"}
                </span>
                <Switch
                  checked={siteData.autoIssue}
                  onChange={handleAutoIssueToggle}
                  disabled={autoIssueLoading}
                />
              </SettingRow>

              <SettingRow
                label="QR 유효시간"
                icon={<Clock className="w-4 h-4" />}
                onEdit={() => setEditQrTimeoutOpen(true)}
              >
                <span className="text-sm text-text font-mono">{siteData.qrTimeout}초</span>
              </SettingRow>
            </>
          )}
        </div>
      </div>

      {/* 모달 */}
      <EditSiteNameModal
        isOpen={editSiteNameOpen}
        onClose={() => setEditSiteNameOpen(false)}
        currentValue={siteData.siteName}
        onSuccess={(name) => setSiteData((d) => ({ ...d, siteName: name }))}
      />
      <EditQrTimeoutModal
        isOpen={editQrTimeoutOpen}
        onClose={() => setEditQrTimeoutOpen(false)}
        siteKey={siteKey}
        currentValue={siteData.qrTimeout}
        onSuccess={(timeout) => setSiteData((d) => ({ ...d, qrTimeout: timeout }))}
      />
    </div>
  );
}
