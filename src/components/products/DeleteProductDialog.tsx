"use client";

import { Loader2, Trash2 } from "lucide-react";

import Alert from "@/components/ui/Alert";
import Button from "@/components//ui/Button";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components//ui/Dialog";

interface DeleteProductDialogProps {
    open: boolean;
    productName?: string;
    loading?: boolean;
    error?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteProductDialog({
    open,
    productName,
    loading = false,
    error,
    onClose,
    onConfirm,
}: DeleteProductDialogProps) {

    if (!open) return null;

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
                        <div className="flex size-11 items-center justify-center rounded-lg bg-danger/10 text-danger">
                            <Trash2 className="size-5" />
                        </div>
                    }
                >
                    <DialogTitle>
                        Delete product?
                    </DialogTitle>

                    <DialogDescription>
                        This action cannot be undone. The product
                        will be permanently removed.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    {productName && (
                        <div className="rounded-md border border-border bg-surface-muted p-4">
                            <p className="text-sm font-medium text-foreground">
                                {productName}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Are you sure you want to delete this
                                product?
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4">
                            <Alert>{error}</Alert>
                        </div>
                    )}
                </DialogBody>

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
                        {loading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <>  <Trash2 className="size-4" /> Delete product</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}