import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: string;
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
    "flex items-center justify-center overflow-hidden rounded-lg font-bold cursor-pointer transition-all";

  const variantClasses = {
    primary: "bg-primary text-white shadow-sm hover:shadow-lg",
    secondary:
      "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200",
    outline: "bg-primary/20 text-primary border border-primary/30",
  };

  const sizeClasses = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="material-symbols-outlined mr-2">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
