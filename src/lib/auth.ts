import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET is not set");
}

const JWT_SECRET = new TextEncoder().encode(secret);

export async function createToken(userId: string) {
    return new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") //7d expiry
        .sign(JWT_SECRET);
}

//use this to verify jwt token access
export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        if (!payload.userId || typeof payload.userId !== "string") {
            return null;
        }

        return {
            userId: payload.userId,
        };
    } catch {
        return null;
    }
}

//get auth user with this helper fn
export async function getAuthUser() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    return verifyToken(token);
}