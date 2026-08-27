import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className ,variant = "primary" ,size="md" ,isLoading,disabled, children, ...props }, ref) => {
        const variants = {
      primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      ghost: "text-gray-700 hover:bg-gray-100",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    

}
)