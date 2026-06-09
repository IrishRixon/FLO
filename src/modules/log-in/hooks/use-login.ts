import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginValues } from "../schema/login.schema";

export const useLoginHook = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setErrorMsg(null);

    try {
      const next = "/";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
            next
          )}`,
        },
      });

      if (error) setErrorMsg(error.message);
    } catch (err: unknown) {
      console.error("Google OAuth login error:", err);
      setErrorMsg("Failed to initiate Google sign in.");
    }
  }

  async function onSubmit(values: LoginValues) {
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return {
    onSubmit,
    handleGoogleLogin,
    loading,
    setLoading,
    errorMsg,
    setErrorMsg,
  };
};

