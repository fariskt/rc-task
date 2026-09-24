import Link from "next/link";

interface LogoProps {
    href?: string;
    showName?: boolean;
}

export default function Logo({
    href = "/",
    showName = true,
}: LogoProps) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-3"
            aria-label="Product Manager home"
        >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                PM
            </span>

            {showName && (
                <span className="font-semibold text-foreground">
                    Product Manager
                </span>
            )}
        </Link>
    );
}