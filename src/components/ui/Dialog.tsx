"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { X } from "lucide-react";

interface DialogContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export function Dialog({
    open,
    onOpenChange,
    children,
}: DialogProps) {
    return (
        <DialogContext.Provider
            value={{
                open,
                setOpen: onOpenChange,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
}

interface DialogContentProps {
    children: ReactNode;
    className?: string;
    showClose?: boolean;
}

export function DialogContent({
    children,
    className = "",
    showClose = true,
}: DialogContentProps) {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error(
            "DialogContent must be used inside Dialog"
        );
    }

    const { open, setOpen } = context;

    useEffect(() => {
        if (!open) {
            return;
        }

        const body = document.body;
        const previousOverflow = body.style.overflow;
        const previousPaddingRight = body.style.paddingRight;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        //fix page shake when scrollbar disapper    
        body.style.overflow = "hidden";

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPaddingRight;

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open, setOpen]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="presentation"
        >
            <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setOpen(false)}
                className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-[2px]"
            />

            <div
                role="dialog"
                aria-modal="true"
                className={`relative z-10 w-full overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:max-w-lg sm:rounded-xl ${className}`}
                onClick={(event) => event.stopPropagation()}
            >
                {showClose && (
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close dialog"
                        className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition hover:bg-surface-muted hover:text-foreground focus:ring-2 focus:ring-ring"
                    >
                        <X className="size-4" />
                    </button>
                )}

                {children}
            </div>
        </div>
    );
}

interface DialogHeaderProps {
    children: ReactNode;
    className?: string;
}

interface DialogHeaderProps {
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}

export function DialogHeader({
    children,
    className = "",
    icon,
}: DialogHeaderProps) {
    return (
        <div
            className={`border-b border-border px-5 py-5 pr-14 sm:px-6 ${className}`}
        >
            <div className="flex items-start gap-3">
                {icon && (
                    <div className="shrink-0">
                        {icon}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface DialogTitleProps {
    children: ReactNode;
    className?: string;
}

export function DialogTitle({
    children,
    className = "",
}: DialogTitleProps) {
    return (
        <h2
            className={`text-lg font-semibold tracking-tight text-foreground ${className}`}
        >
            {children}
        </h2>
    );
}

interface DialogDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function DialogDescription({
    children,
    className = "",
}: DialogDescriptionProps) {
    return (
        <p
            className={`mt-1.5 text-sm leading-6 text-muted-foreground ${className}`}
        >
            {children}
        </p>
    );
}

interface DialogBodyProps {
    children: ReactNode;
    className?: string;
}

export function DialogBody({
    children,
    className = "",
}: DialogBodyProps) {
    return (
        <div className={`px-5 py-5 sm:px-6 ${className}`}>
            {children}
        </div>
    );
}

interface DialogFooterProps {
    children: ReactNode;
    className?: string;
}

export function DialogFooter({
    children,
    className = "",
}: DialogFooterProps) {
    return (
        <div
            className={`flex flex-col-reverse gap-2 border-t border-border bg-surface-muted/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 ${className}`}
        >
            {children}
        </div>
    );
}