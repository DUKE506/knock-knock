"use client";

import { ButtonProps } from "@/types/ui/button";

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isLoading = false,
  title,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Variant 스타일
  const variantStyles = {
    primary: "bg-accent text-white hover:bg-[#059669] border-accent",
    secondary:
      "bg-transparent text-text-2 border-border-2 hover:text-text hover:border-accent hover:bg-accent-dim",
    danger: "bg-red text-white hover:bg-[#DC2626] border-red",
    ghost:
      "bg-transparent text-text-2 hover:text-text hover:bg-surface-2 border-transparent",
  };

  // Size 스타일
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1",
    md: "px-3.5 py-2 text-[13px] gap-1.5",
    lg: "px-4 py-2.5 text-sm gap-2",
  };

  // 아이콘 크기
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-4 h-4",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md border
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!isLoading && Icon && iconPosition === "left" && (
        <Icon className={iconSizes[size]} />
      )}
      {title}
      {!isLoading && Icon && iconPosition === "right" && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
}
