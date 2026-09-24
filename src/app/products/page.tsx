import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductsDashboard from "@/components/products/ProductDashboard";

export default async function ProductsPage() {
    const user = await getAuthUser();

    if (!user) {
        redirect("/login");
    }

    return <ProductsDashboard />;
}