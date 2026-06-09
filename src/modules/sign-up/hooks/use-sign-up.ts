import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SignupValues } from "../schema/sign-up.schema";

export const useSignUpHook = () => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    async function handleGoogleSignup() {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                },
            });

            if (error) toast.error(error.message);
        } catch (err: unknown) {
            console.error("Google OAuth signup error:", err);
            toast.error("Failed to initiate Google sign up.");
        }
    }

    async function onSubmit(values: SignupValues) {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    full_name: values.fullName,
                },
                emailRedirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        // If the user already exists, identities array will be empty
        if (data.user?.identities?.length === 0) {
            toast.error("This email is already registered. Please log in instead.");
            setLoading(false);
            return;
        }

        if (data.user && data.session) {
            router.push("/");
            router.refresh();
            setLoading(false);
            return;
        }

        toast.success(
            "Sign up successful! Please check your email to verify your account.",
        );
        setLoading(false);
    }

    function getPasswordStrength(pass: string) {
      if (!pass) {
        return { label: "Empty", color: "bg-text-muted", width: "w-0" };
      }
    
      let score = 0;
      if (pass.length >= 8) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;
    
      switch (score) {
        case 1:
          return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
        case 2:
          return { label: "Fair", color: "bg-[#FFB84D]", width: "w-2/4" };
        case 3:
          return { label: "Good", color: "bg-primary", width: "w-3/4" };
        case 4:
          return { label: "Strong", color: "bg-secondary", width: "w-full" };
        default:
          return { label: "Weak", color: "bg-destructive", width: "w-1/12" };
      }
    }

    return {
        onSubmit,
        handleGoogleSignup,
        loading,
        setLoading,
        getPasswordStrength
    }
}