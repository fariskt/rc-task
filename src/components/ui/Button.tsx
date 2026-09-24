import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-4 focus:ring-ring/30",
    ghost:
        "bg-transparent text-muted-foreground",
    danger:
        "bg-danger text-primary-foreground hover:opacity-90 focus:ring-danger/30",
};

export default function Button({
    children,
    variant = "primary",
    loading = false,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-medium outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}