"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Button from "./Button";

interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    totalPages,
    total,
    loading = false,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} · {total} items
            </p>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    disabled={page === 1 || loading}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    disabled={
                        page === totalPages || loading
                    }
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}