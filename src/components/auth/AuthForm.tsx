"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components//ui/Button";
import Input from "@/components//ui/Input";
import Label from "@/components//ui/Label";
import Alert from "@/components//ui/Alert";
import { useAuth } from "./AuthContext";

type AuthMode = "login" | "register";

interface AuthFormProps {
    mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const isRegister = mode === "register";
    const { login, register, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        try {
            if (isRegister) {
                await register(email, password);
            } else {
                await login(email, password);
            }

            router.push("/products");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        }
    }

    return (
        <div className="mx-auto my-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
            <header className="mb-8 text-center">

                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {isRegister
                        ? "Create your account"
                        : "Welcome back"}
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {isRegister
                        ? "Create an account to start managing your products."
                        : "Sign in to continue to your product workspace."}
                </p>
            </header>

            {error && (
                <div className="mb-5">
                    <Alert>{error}</Alert>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email address
                    </Label>

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password
                    </Label>

                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            autoComplete={
                                isRegister
                                    ? "new-password"
                                    : "current-password"
                            }
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            minLength={
                                isRegister ? 6 : undefined
                            }
                            disabled={loading}
                            className="pr-11"
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                                setShowPassword(
                                    (value) => !value
                                )
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            className="absolute right-0 top-1 flex p-2 items-center justify-center"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </Button>
                    </div>

                    {isRegister && (
                        <p className="text-xs text-muted-foreground">
                            Use at least 6 characters.
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    loading={loading}
                    className="h-11 w-full"
                >
                    {loading && (
                        <Loader2 className="size-4 animate-spin" />
                    )}

                    {loading
                        ? isRegister
                            ? "Creating account..."
                            : "Signing in..."
                        : isRegister
                            ? "Create account"
                            : "Sign in"}
                </Button>
            </form>

            <div className="mt-7 text-center text-sm text-muted-foreground">
                {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}

                <Link
                    href={
                        isRegister
                            ? "/login"
                            : "/register"
                    }
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    {isRegister
                        ? "Sign in"
                        : "Create an account"}
                </Link>
            </div>
        </div>
    );
}