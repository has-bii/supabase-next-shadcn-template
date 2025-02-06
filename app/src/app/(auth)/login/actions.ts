"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type InitState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  success?: boolean;
  message?: string;
  raw_input?: {
    email?: string;
  };
};

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(
  _: InitState | null,
  formData: FormData,
): Promise<InitState> {
  const supabase = await createClient();

  const { error, data } = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (error)
    return {
      errors: error.flatten().fieldErrors,
      success: false,
      raw_input: {
        email: formData.get("email") as string | undefined,
      },
    };

  const { error: errorLogin } = await supabase.auth.signInWithPassword(data);

  if (errorLogin) {
    return {
      success: false,
      message: errorLogin.message,
      raw_input: {
        ...data,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
