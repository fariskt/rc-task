"use client";

import { ArrowLeft, CalendarDays, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useState } from "react";

export interface ProductViewData {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

interface ProductViewProps {
    product: ProductViewData;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);
}

export default function ProductView({
    product,
}: ProductViewProps) {
    const router = useRouter();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const inventoryValue = product.quantity * product.price;

    async function handleDelete() {
        setDeleting(true);
        setError("");

        try {
            const response = await fetch(
                `/api/products/${product._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                router.replace("/login");
                return;
            }

            if (!response.ok) {
                setError(
                    data?.message ||
                    "Unable to delete the product."
                );
                return;
            }

            setDeleteOpen(false);
            router.push("/products");
            router.refresh();
        } catch {
            setError(
                "Failed to connect to the server. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="size-4" />
                            Back to products
                        </Button>
                    </div>

                    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
                        <div className="border-b border-border px-5 py-5 sm:px-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Package className="size-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <h1 className="truncate text-xl font-semibold text-foreground">
                                            {product.name}
                                        </h1>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Product details
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={() =>
                                        setDeleteOpen(true)
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-md border border-border bg-surface-muted p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Product name
                                    </p>

                                    <p className="mt-2 break-words text-sm font-medium text-foreground">
                                        {product.name}
                                    </p>
                                </div>

                                <div className="rounded-md border border-border bg-surface-muted p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Category
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-foreground">
                                        {product.category}
                                    </p>
                                </div>

                                <div className="rounded-md border border-border bg-surface-muted p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Quantity
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-foreground">
                                        {product.quantity}
                                    </p>
                                </div>

                                <div className="rounded-md border border-border bg-surface-muted p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        Unit price
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-foreground">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-md border border-border p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Total inventory value
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Quantity × unit price
                                        </p>
                                    </div>

                                    <p className="text-lg font-semibold text-foreground">
                                        {formatPrice(
                                            inventoryValue
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-border pt-5">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarDays className="size-4" />
                                    <span>
                                        Created{" "}
                                        {formatDate(
                                            product.createdAt
                                        )}
                                    </span>
                                </div>

                                {product.updatedAt !==
                                    product.createdAt && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarDays className="size-4" />
                                            <span>
                                                Updated{" "}
                                                {formatDate(
                                                    product.updatedAt
                                                )}
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Dialog
                open={deleteOpen}
                onOpenChange={(open) => {
                    if (!deleting) {
                        setDeleteOpen(open);
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
                        <div className="rounded-md border border-border bg-surface-muted p-4">
                            <p className="text-sm font-medium text-foreground">
                                {product.name}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {product.category} ·{" "}
                                {product.quantity} units
                            </p>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-danger">
                                {error}
                            </p>
                        )}
                    </DialogBody>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={deleting}
                            onClick={() =>
                                setDeleteOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            loading={deleting}
                            onClick={handleDelete}
                        >
                            <Trash2 className="size-4" />
                            Delete product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}