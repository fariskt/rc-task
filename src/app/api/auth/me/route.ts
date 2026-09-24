import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
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

        await connectDB();

        const user = await User.findById(authUser.userId)
            .select("_id email")
            .lean();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get current user",
            },
            { status: 500 }
        );
    }
}