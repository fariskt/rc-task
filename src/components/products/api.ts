import { Product } from "@/types";

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductsResponse {
    products: Product[];
    pagination: Pagination;
}

export async function fetchProducts(
    page: number,
    limit: number,
    search?: string
): Promise<ProductsResponse> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search) {
        params.set("search", search);
    }

    const response = await fetch(
        `/api/products?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message || "Failed to load products"
        );
    }

    return {
        products: data.products ?? [],
        pagination: data.pagination,
    };
}

export async function deleteProduct(id: string) {
    const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message || "Failed to delete product"
        );
    }

    return data;
}