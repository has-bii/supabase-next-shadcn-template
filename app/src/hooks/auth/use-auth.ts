import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";

export const useGetAuth = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });
