"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Loader, Mail } from "lucide-react";
import { forgot } from "./actions";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [state, formAction, isPending] = React.useActionState(forgot, null);

  return (
    <form className="p-6 md:p-8" action={formAction}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-balance text-muted-foreground">
            No worries, We&apos;ll send you OTP
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <Mail />}
          Send OTP
        </Button>
        <div className="text-center text-sm">
          <Link href="/login" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
