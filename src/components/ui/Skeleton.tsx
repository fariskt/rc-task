import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> { }

export default function Skeleton({
    className = "",
    ...props
}: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-md bg-surface-muted ${className}`}
            {...props}
        />
    );
}