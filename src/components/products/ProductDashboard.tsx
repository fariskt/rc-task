"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    Boxes,
    ChevronRight,
    CircleAlert,
    Loader2,
    LogOut,
    Package,
    Plus,
    Search,
    ShoppingBag,
    Trash2,
    UserRound,
} from "lucide-react";
import Button from "../ui/Button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/Dialog";
import ProductForm from "./ProductForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProducts, Pagination as PaginationType } from "./api";
import DeleteProductDialog from "./DeleteProductDialog";
import { Product } from "@/types";
import Input from "../ui/Input";
import Table, { TableColumn } from "../ui/Table";



export default function ProductsDashboard() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null); //selected prdct to delete

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const {
        data,
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["products", page, debouncedSearch],
        queryFn: () => fetchProducts(page, 10, debouncedSearch),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });


    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            setConfirmDialog(false)
            setDeletingProduct(null)
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
    });


    const handleOpenProductDialog = () => {
        setOpenDialog(true)
    }

    const products = data?.products ?? [];
    const pagination = data?.pagination;

    const columns: TableColumn<Product>[] = [
        {
            key: "product",
            header: "Product",
            render: (product: Product) => (
                <Link
                    href={`/products/${product._id}`}
                    className="flex items-center gap-4"
                >
                    <div className="hidden size-11 shrink-0 items-center justify-center rounded-lg bg-surface-muted sm:flex">
                        <Package className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate font-medium text-foreground">
                            {product.name}
                        </h3>
                    </div>
                </Link>
            ),
        },
        {
            key: "category",
            header: "Category",
            render: (product: Product) => (
                <span className="text-sm text-foreground">
                    {product.category}
                </span>
            ),
        },
        {
            key: "quantity",
            header: "Quantity",
            render: (product: Product) => (
                <span className="text-sm text-foreground">
                    {product.quantity}{" "}
                    {product.quantity === 1
                        ? "unit"
                        : "units"}
                </span>
            ),
        },
        {
            key: "price",
            header: "Price",
            render: (product: Product) => (
                <span className="font-medium text-foreground">
                    {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 2,
                    }).format(product.price)}
                </span>
            ),
        },
        {
            key: "createdAt",
            header: "Created",
            render: (product: Product) => (
                <span className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                    }).format(new Date(product.createdAt))}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "md:text-right",
            render: (product: Product) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/products/${product._id}`}
                        className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label={`View ${product.name}`}
                    >
                        <ChevronRight className="size-4" />
                    </Link>

                    <Button
                        variant="danger"
                        onClick={() => {
                            setDeletingProduct(product);
                            setConfirmDialog(true);
                        }}
                        aria-label={`Delete ${product.name}`}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-dvh bg-background text-foreground">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader icon={<div className="hidden md:flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="size-5" />
                    </div>}>
                        <DialogTitle>Create Product</DialogTitle>
                        <DialogDescription>
                            Add a new product
                        </DialogDescription>
                    </DialogHeader>
                    <DialogBody>
                        <ProductForm onCancel={() => setOpenDialog(false)} onSuccess={() => {
                            setOpenDialog(false)
                            queryClient.invalidateQueries({
                                queryKey: ["products"],
                            });
                        }} />
                    </DialogBody>
                </DialogContent>
            </Dialog>

            <DeleteProductDialog loading={deleteMutation.isPending} open={confirmDialog} productName={deletingProduct?.name} onClose={() => setConfirmDialog(false)} onConfirm={() => deleteMutation.mutate(deletingProduct?._id!)} />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Products
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                            Manage your products, inventory quantities, and pricing
                            from one place.
                        </p>
                    </div>

                    <Button
                        onClick={handleOpenProductDialog}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/30"
                    >
                        <Plus className="size-4" />
                        Add product
                    </Button>
                </div>

                <section className="overflow-hidden rounded-lg border border-border bg-surface">
                    <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="font-semibold">Product inventory</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {data?.pagination.total}{" "}
                                {data?.pagination.total === 1
                                    ? "product"
                                    : "products"}{" "}
                                shown
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row">
                            <div className="relative w-full md:flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search products..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                    </div>

                    {error && (
                        <div className="m-4 flex items-start gap-3 rounded-md border border-danger/20 bg-danger-surface p-4 text-sm text-danger">
                            <CircleAlert className="mt-0.5 size-4 shrink-0" />

                            <div className="flex-1">
                                <p className="font-medium">Something went wrong</p>
                                <p className="mt-1">{error?.message || "unknown error"}</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="font-medium underline underline-offset-4"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex min-h-80 items-center justify-center p-6">
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <Loader2 className="size-6 animate-spin" />
                                <p className="text-sm">Loading products...</p>
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
                            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-muted">
                                {search ? (
                                    <Search className="size-5 text-muted-foreground" />
                                ) : (
                                    <Package className="size-5 text-muted-foreground" />
                                )}
                            </div>

                            <h3 className="font-semibold">
                                {search
                                    ? "No products found"
                                    : "No products yet"}
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                                {search
                                    ? "Try a different product name or category."
                                    : "Add your first product to start managing your inventory."}
                            </p>

                            {!search && (
                                <Button
                                    onClick={handleOpenProductDialog}
                                >
                                    <Plus className="size-4" />
                                    Add your first product
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table
                                data={products}
                                loading={loading}
                                columns={columns}
                                keyExtractor={(product: any) => product._id}
                                emptyMessage="No products found."
                                pagination={pagination as PaginationType}
                                page={page}
                                setPage={setPage}
                            />

                        </>
                    )}

                </section>
            </main>
        </div>
    );
}