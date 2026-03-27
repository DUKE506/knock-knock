import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-text mb-2">
            {label}
            {required && <span className="text-red ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm border rounded-sm outline-none transition-colors
            ${
              error
                ? "border-red focus:border-red"
                : "border-border focus:border-accent"
            }
            ${props.disabled ? "bg-bg cursor-not-allowed opacity-60" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Error Message */}
        {error && <p className="text-xs text-red mt-1">{error}</p>}

        {/* Helper Text */}
        {!error && helperText && (
          <p className="text-xs text-text-3 mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

export default Input;
