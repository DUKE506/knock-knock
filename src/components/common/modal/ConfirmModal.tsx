"use client";

import { LucideIcon } from "lucide-react";
import BaseModal from "./BaseModal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  icon?: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  variant = "default",
  icon: Icon,
  iconColor,
  isLoading = false,
}: ConfirmModalProps) {
  const iconBg =
    iconColor ??
    (variant === "danger" ? "bg-red-dim text-red" : "bg-accent-dim text-accent");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      onSubmit={onConfirm}
      submitText={confirmText}
      cancelText={cancelText}
      isLoading={isLoading}
      submitVariant={variant === "danger" ? "danger" : "primary"}
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        {Icon && (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
        {description && (
          <p className="text-sm text-text-2 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}
      </div>
    </BaseModal>
  );
}
