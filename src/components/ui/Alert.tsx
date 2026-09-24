import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface AlertProps {
    children: ReactNode;
    variant?: "error" | "info";
}

export default function Alert({
    children,
    variant = "error",
}: AlertProps) {
    const styles =
        variant === "error"
            ? "border-danger/20 bg-danger-surface text-danger"
            : "border-border bg-surface-muted text-muted-foreground";

    return (
        <div
            role="alert"
            className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${styles}`}
        >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <div>{children}</div>
        </div>
    );
}