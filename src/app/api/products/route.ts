import { NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Product from "@/models/Product";

const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Product name is required" }),

    category: z
        .string()
        .trim()
        .min(1, { message: "Category is required" }),

    quantity: z
        .number()
        .min(0, { message: "Quantity cannot be less than 0" }),

    price: z
        .number()
        .min(0, { message: "Price cannot be negative" }),
});


export async function GET(request: Request) {
    try {
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search")?.trim() ?? "";
        const category = searchParams.get("category")?.trim() ?? "";

        await connectDB();

        const query: Record<string, unknown> = {
            userId: authUser.userId,
        };

        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (category) {
            query.category = category;
        }

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 10,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (error) {
        console.error("Get products error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
            },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = await request.json();

        const result = productSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        await connectDB();

        const product = await Product.create({
            ...result.data,
            userId: authUser.userId,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Product created successfully",
                product,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create product",
            },
            { status: 500 }
        );
    }
}