"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import { BaseModalProps } from "@/types/modal";

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "확인",
  cancelText = "취소",
  size = "md",
  showFooter = true,
  isLoading = false,
  submitDisabled = false,
}: BaseModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // 모달 크기
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !isLoading && !submitDisabled) {
      onSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-surface rounded-radius-lg shadow-shadow-xl w-full ${sizeClasses[size]} animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="p-1 rounded-radius-md text-text-3 hover:text-text hover:bg-surface-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-bg/50">
              <Button
                type="button"
                variant="secondary"
                title={cancelText}
                onClick={onClose}
                disabled={isLoading}
              />
              {onSubmit && (
                <Button
                  type="submit"
                  variant="primary"
                  title={submitText}
                  isLoading={isLoading}
                  disabled={submitDisabled}
                />
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
