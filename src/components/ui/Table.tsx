import type { ReactNode } from "react";
import Skeleton from "./Skeleton";
import Pagination from "./Pagination";
import { Pagination as PaginationType } from "../products/api";

export interface TableColumn<T> {
    key: string;
    header: string;
    className?: string;
    render: (item: T) => ReactNode;
}
interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    loading?: boolean;
    skeletonRows?: number;
    pagination: PaginationType;
    page: number;
    setPage: (page: number) => void;
}

export default function Table<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = "No data found.",
    loading,
    skeletonRows = 5,
    pagination,
    page,
    setPage,
}: TableProps<T>) {

    if (loading) {
        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="hidden border-b border-border bg-surface-muted md:table-header-group">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground ${column.className ?? ""}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {Array.from({
                            length: skeletonRows,
                        }).map((_, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="block md:table-row"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`block px-4 py-3 md:table-cell md:px-5 md:py-4 ${column.className ?? ""}`}
                                    >
                                        <div className="flex items-center justify-between gap-4 md:block">
                                            <span className="text-xs font-medium text-muted-foreground md:hidden">
                                                {column.header}
                                            </span>

                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="max-h-90 overflow-auto">
                <table className="min-w-[700px] w-full border-collapse">
                    <thead className="sticky top-0 z-10 border-b border-border bg-surface-muted">                        <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground ${column.className ?? ""
                                    }`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className="group transition hover:bg-surface-muted/50"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-4 py-3 md:px-5 md:py-4 ${column.className ?? ""
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4 md:block">

                                            <div>
                                                {column.render(item)}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={page}
                totalPages={pagination?.totalPages ?? 1}
                total={pagination?.total ?? 0}
                loading={loading}
                onPageChange={setPage}
            />
        </div>
    );
}