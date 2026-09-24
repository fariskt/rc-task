"use client"

import type { ReactNode } from "react";
import { Sidebar } from "@/components/products/Sidebar";
interface ProductLayoutProps {
    children: ReactNode;
}

export default function ProductLayout({
    children,
}: ProductLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <Sidebar />
                <main className="min-w-0 flex-1 pt-14 lg:pt-0 lg:pl-64">
                    {children}
                </main>
            </div>
        </div>
    );
}