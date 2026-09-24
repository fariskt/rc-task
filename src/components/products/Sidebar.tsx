"use client";

import Link from "next/link";
import {
    Boxes,
    LogOut,
    Menu,
    UserRound,
    X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "../ui/Button";
import LogoutDialog from "../auth/LogoutDialog";
import Logo from "../ui/Logo";
import { useAuth } from "../auth/AuthContext";

interface NavigationItem {
    label: string;
    href: string;
    icon: typeof Boxes;
}

const navigationItems: NavigationItem[] = [
    {
        label: "Products",
        href: "/products",
        icon: Boxes,
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open]);

    async function handleLogout() {
        try {
            setLogoutLoading(true);

            await logout();

            setConfirmLogout(false);
            setOpen(false);

            router.replace("/login");
            router.refresh();
        } catch {
            router.replace("/login");
        } finally {
            setLogoutLoading(false);
        }
    }

    return (
        <>
            <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
                <div className="flex justify-between w-full">
                    <div className="">
                        <Logo showName={false} />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        aria-label="Open navigation"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={16} />
                    </Button>
                </div>
            </div>

            {open && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 border-r border-border bg-surface transition-transform duration-200 lg:translate-x-0 ${open
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    <header className="border-b border-border bg-surface/95 backdrop-blur">
                        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                            <Logo />

                            <Button
                                type="button"
                                variant="ghost"
                                className="lg:hidden"
                                aria-label="Close navigation"
                                onClick={() => setOpen(false)}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </header>

                    <nav className="flex-1 space-y-1 p-3">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;

                            const isActive =
                                item.href === "/products"
                                    ? pathname ===
                                    "/products"
                                    : pathname.startsWith(
                                        item.href
                                    );

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-border p-3">
                        <div className="flex items-center justify-between gap-2 rounded-md bg-surface-muted px-3 py-2.5">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserRound className="size-4" />
                                </div>

                                <p className="text-sm font-medium text-foreground">
                                    Account
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                className="shrink-0 p-0 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                                aria-label="Sign out"
                                onClick={() =>
                                    setConfirmLogout(
                                        true
                                    )
                                }
                            >
                                <LogOut size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            <LogoutDialog
                open={confirmLogout}
                onClose={() => {
                    if (!logoutLoading) {
                        setConfirmLogout(false);
                    }
                }}
                onConfirm={handleLogout}
                loading={logoutLoading}
            />
        </>
    );
};