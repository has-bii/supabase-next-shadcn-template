"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "./actions";
import Link from "next/link";
import React from "react";
import { Loader, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [state, formAction, isPending] = React.useActionState(signup, null);

  return (
    <form className="p-6 md:p-8" action={formAction}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Get started</h1>
          <p className="text-balance text-muted-foreground">
            Create your account now
          </p>
        </div>
        {state?.message ? (
          <div
            className={cn(
              "flex w-full items-center justify-center rounded-md border py-4",
              state.success
                ? "border-green-400 bg-green-50"
                : "border-destructive bg-destructive/10",
            )}
          >
            <p
              className={cn(
                "max-w-sm text-center text-sm",
                state.success ? "text-green-500" : "text-destructive",
              )}
            >
              {state.message}
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Hasbiy Robbiy"
            defaultValue={state?.raw_input?.name}
            required
          />
          {state?.errors?.name && (
            <span className="text-sm text-destructive">
              {state.errors.name[0]}
            </span>
          )}
        </div>
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
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          {state?.errors?.password && (
            <span className="text-sm text-destructive">
              {state.errors.password[0]}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <LogIn />}
          Register
        </Button>
        <div className="text-center text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
