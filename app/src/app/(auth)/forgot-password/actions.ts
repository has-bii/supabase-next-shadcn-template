"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type InitState = {
  errors?: {
    email?: string[];
  };
  success?: boolean;
  message?: string;
  raw_input?: {
    email?: string;
  };
};

const schema = z.object({
  email: z.string().email(),
});

export async function forgot(
  _: InitState | null,
  formData: FormData,
): Promise<InitState> {
  const supabase = await createClient();

  const { error, data } = schema.safeParse({
    email: formData.get("email"),
  });

  if (error)
    return {
      errors: error.flatten().fieldErrors,
      success: false,
      raw_input: {
        email: formData.get("email") as string | undefined,
      },
    };

  const { error: errorLogin } = await supabase.auth.resetPasswordForEmail(
    data.email,
  );

  if (errorLogin) {
    return {
      success: false,
      message: errorLogin.message,
      raw_input: {
        ...data,
      },
    };
  }

  return {
    success: true,
    message: "OTP has been sent to your email.",
  };
}
