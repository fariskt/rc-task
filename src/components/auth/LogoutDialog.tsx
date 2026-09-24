"use client";

import { LogOut } from "lucide-react";

import Button from "@/components//ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components//ui/Dialog";

interface LogoutDialogProps {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutDialog({
    open,
    loading = false,
    onClose,
    onConfirm,
}: LogoutDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                if (!loading) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader
                    icon={
                        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <LogOut className="size-5" />
                        </div>
                    }
                >
                    <DialogTitle>
                        Sign out?
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to sign out of your
                        account?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={loading}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        loading={loading}
                        onClick={onConfirm}
                    >
                        <LogOut className="size-4" />
                        Sign out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}