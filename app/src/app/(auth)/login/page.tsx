"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Loader, LogIn } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = React.useActionState(login, null);

  return (
    <form className="p-6 md:p-8" action={formAction}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">
            Login to your account
          </p>
        </div>
        {state?.message && !state.success ? (
          <div className="flex w-full items-center justify-center rounded-md border border-destructive bg-destructive/10 py-4">
            <p className="max-w-sm text-center text-sm text-destructive">
              {state.message}
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            defaultValue={state?.raw_input?.email}
            required
          />
          {state?.errors?.email && (
            <span className="text-sm text-destructive">
              {state.errors.email[0]}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
          {state?.errors?.password && (
            <span className="text-sm text-destructive">
              {state.errors.password[0]}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <LogIn />}
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span>Login with Google</span>
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?&nbsp;
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}
