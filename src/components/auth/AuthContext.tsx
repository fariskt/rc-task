"use client";

import {
    createContext,
    ReactNode,
    useContext,
} from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

interface AuthUser {
    id: string;
    email: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (
        email: string,
        password: string
    ) => Promise<void>;
    register: (
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    );

interface AuthProviderProps {
    children: ReactNode;
}

async function fetchCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            "Failed to fetch current user"
        );
    }

    const data = await response.json();

    return data.user ?? null;
}

async function loginUser(
    email: string,
    password: string
): Promise<AuthUser> {
    const response = await fetch(
        "/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message || "Failed to sign in"
        );
    }

    return data.user;
}

async function registerUser(
    email: string,
    password: string
): Promise<AuthUser> {
    const response = await fetch(
        "/api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Failed to create account"
        );
    }

    return data.user;
}

async function logoutUser() {
    const response = await fetch(
        "/api/auth/logout",
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to sign out"
        );
    }
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const queryClient = useQueryClient();

    const {
        data: user = null,
        isLoading: userLoading,
    } = useQuery({
        queryKey: ["auth", "user"],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => loginUser(email, password),
        onSuccess: (user) => {
            queryClient.setQueryData(
                ["auth", "user"],
                user
            );
        },
    });

    const registerMutation = useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => registerUser(email, password),
        onSuccess: (user) => {
            queryClient.setQueryData(
                ["auth", "user"],
                user
            );
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(
                ["auth", "user"],
                null
            );

            queryClient.removeQueries({
                queryKey: ["products"],
            });
        },
    });

    async function login(
        email: string,
        password: string
    ) {
        await loginMutation.mutateAsync({
            email,
            password,
        });
    }

    async function register(
        email: string,
        password: string
    ) {
        await registerMutation.mutateAsync({
            email,
            password,
        });
    }

    async function logout() {
        await logoutMutation.mutateAsync();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading:
                    userLoading ||
                    loginMutation.isPending ||
                    registerMutation.isPending ||
                    logoutMutation.isPending,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context;
}