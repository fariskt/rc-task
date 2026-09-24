import type { ReactNode } from "react";
import Logo from "@/components/ui/Logo";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="h-screen bg-background text-foreground">
            <div className="absolute left-3 top-3">
                <div className="flex items-center gap-3">
                    <Logo />
                </div>
            </div>
            <div>
                <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
                    {children}
                </section>
            </div>
            <p className="text-sm absolute inset-x-0 bottom-2 text-center opacity-60">
                © {new Date().getFullYear()} Product Manager
            </p>
        </main>
    );
}