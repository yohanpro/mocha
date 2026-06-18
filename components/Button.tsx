import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-bold rounded-[12px] transition-all duration-200 cursor-pointer font-sans";

  const variantStyles = {
    primary:
      "bg-green-600 text-white shadow-md hover:bg-green-700 active:scale-95",
    secondary:
      "bg-white text-green-600 border-2 border-green-600 hover:bg-green-100 active:scale-95",
    text: "bg-none text-ink-soft hover:text-ink active:scale-95 underline-offset-2 hover:underline",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}
