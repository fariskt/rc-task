import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export default function Input({
    error = false,
    className = "",
    ...props
}: InputProps) {
    return (
        <input
            className={`h-11 w-full rounded-md border bg-surface px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${error
                    ? "border-danger focus:border-danger focus:ring-danger/20"
                    : "border-border focus:border-border-focus focus:ring-ring/20"
                } ${className}`}
            {...props}
        />
    );
}