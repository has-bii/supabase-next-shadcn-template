"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { email, full_name, password } from "@/lib/form-schema";

const signupSchema = z.object({
  name: full_name,
  email: email,
  password: password,
});

type InitState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  success?: boolean;
  message?: string;
  raw_input?: {
    name?: string;
    email?: string;
  };
};

export async function signup(
  _: InitState | null,
  formData: FormData,
): Promise<InitState> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: parsedData, error } = signupSchema.safeParse(data);

  if (error)
    return {
      errors: error.flatten().fieldErrors,
      success: false,
      raw_input: { ...data },
    };

  const { error: errorSignUp } = await supabase.auth.signUp({
    email: parsedData.email,
    password: parsedData.password,
    options: {
      data: {
        full_name: parsedData.name,
      },
    },
  });

  if (errorSignUp)
    return {
      message: errorSignUp.message,
      success: false,
      raw_input: { ...data },
    };

  return {
    success: true,
    message: "Registered successfully. Check your email to verify account.",
  };
}
