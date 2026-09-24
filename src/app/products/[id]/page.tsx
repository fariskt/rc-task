import { notFound, redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductDetails from "@/components//products/ProductDetails";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const authUser = await getAuthUser();

    if (!authUser) {
        redirect("/login");
    }

    const { id } = await params;

    await connectDB();

    const product = await Product.findOne({
        _id: id,
        userId: authUser.userId,
    }).lean();

    if (!product) {
        notFound();
    }

    return (
        <ProductDetails
            product={{
                _id: product._id,
                name: product.name,
                category: product.category,
                quantity: product.quantity,
                price: product.price,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
            }}
        />
    );
}