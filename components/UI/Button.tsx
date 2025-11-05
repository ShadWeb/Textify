import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseClasses =
    "flex items-center justify-center overflow-hidden rounded-lg font-bold cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";

  const variantClasses = {
    primary:
      "bg-primary text-white shadow-sm hover:shadow-lg hover:bg-primary/90 focus:ring-primary/50 dark:focus:ring-offset-slate-900",
    secondary:
      "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-300 dark:focus:ring-slate-600",
    outline:
      "bg-transparent text-primary border border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-primary/30",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-300 dark:focus:ring-slate-600",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm gap-1.5",
    md: "h-12 px-6 text-base gap-2",
    lg: "h-14 px-8 text-lg gap-2.5",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed hover:shadow-none";

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? disabledClasses : ""}
        ${className}
      `.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
