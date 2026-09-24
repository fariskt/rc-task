"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components//ui/Button";
import Input from "@/components//ui/Input";
import Label from "@/components//ui/Label";
import Alert from "@/components//ui/Alert";

export interface ProductFormData {
    name: string;
    category: string;
    quantity: number;
    price: number;
}

interface ProductFormProps {
    mode?: "create" | "edit";
    productId?: string;
    initialData?: ProductFormData;
    onSuccess?: (product: ProductFormData) => void;
    onCancel?: () => void;
}

const defaultValues: ProductFormData = {
    name: "",
    category: "",
    quantity: 0,
    price: 0,
};

export default function ProductForm({
    mode = "create",
    productId,
    initialData,
    onSuccess,
    onCancel,
}: ProductFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<ProductFormData>(
        initialData ?? defaultValues
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [fieldErrors, setFieldErrors] = useState<
        Record<string, string[]>
    >({});

    const isEdit = mode === "edit";

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    function updateField<K extends keyof ProductFormData>(
        field: K,
        value: ProductFormData[K]
    ) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));

        setFieldErrors((current) => ({
            ...current,
            [field]: [],
        }));

        setError("");
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");
        setFieldErrors({});

        try {
            const endpoint = isEdit
                ? `/api/products/${productId}`
                : "/api/products";

            const response = await fetch(endpoint, {
                method: isEdit ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.status === 401) {
                router.replace("/login");
                return;
            }

            if (!response.ok) {
                setError(
                    data?.message ||
                    "Unable to save the product."
                );

                if (data?.errors) {
                    setFieldErrors(data.errors);
                }

                return;
            }

            if (onSuccess) {
                onSuccess(data.product);
                return;
            }

            router.push(
                isEdit
                    ? `/products/${productId}`
                    : "/products"
            );

            router.refresh();
        } catch {
            setError(
                "Failed to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    function getFieldError(field: keyof ProductFormData) {
        return fieldErrors[field]?.[0];
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {error && <Alert>{error}</Alert>}

            <div className="grid gap-5">
                <div className="space-y-2">
                    <Label htmlFor="product-name">
                        Product name
                    </Label>

                    <Input
                        id="product-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="e.g. Wireless headphones"
                        disabled={loading}
                        error={Boolean(
                            getFieldError("name")
                        )}
                        required
                    />

                    {getFieldError("name") && (
                        <p className="text-xs text-danger">
                            {getFieldError("name")}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="product-category">
                        Category
                    </Label>

                    <Input
                        id="product-category"
                        name="category"
                        type="text"
                        value={formData.category}
                        onChange={(event) =>
                            updateField(
                                "category",
                                event.target.value
                            )
                        }
                        placeholder="e.g. Electronics"
                        disabled={loading}
                        error={Boolean(
                            getFieldError("category")
                        )}
                        required
                    />

                    {getFieldError("category") && (
                        <p className="text-xs text-danger">
                            {getFieldError("category")}
                        </p>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="product-quantity">
                            Quantity
                        </Label>

                        <Input
                            id="product-quantity"
                            name="quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={formData.quantity}
                            onChange={(event) =>
                                updateField(
                                    "quantity",
                                    Number(event.target.value)
                                )
                            }
                            placeholder="0"
                            disabled={loading}
                            error={Boolean(
                                getFieldError("quantity")
                            )}
                            required
                        />

                        {getFieldError("quantity") && (
                            <p className="text-xs text-danger">
                                {getFieldError("quantity")}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="product-price">
                            Price
                        </Label>

                        <Input
                            id="product-price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(event) =>
                                updateField(
                                    "price",
                                    Number(event.target.value)
                                )
                            }
                            placeholder="0.00"
                            disabled={loading}
                            error={Boolean(
                                getFieldError("price")
                            )}
                            required
                        />

                        {getFieldError("price") && (
                            <p className="text-xs text-danger">
                                {getFieldError("price")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={loading}
                        className="h-11"
                    >
                        Cancel
                    </Button>
                )}

                <Button
                    type="submit"
                    loading={loading}
                    className="h-11 min-w-32"
                >
                    {loading && (
                        <Loader2 className="size-4 animate-spin" />
                    )}

                    {loading
                        ? isEdit
                            ? "Saving..."
                            : "Creating..."
                        : isEdit
                            ? "Save changes"
                            : "Create product"}
                </Button>
            </div>
        </form>
    );
}