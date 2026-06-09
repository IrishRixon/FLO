"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { createClient } from "@/lib/supabase/client";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: ResetPasswordValues) {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#0F0F10] p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span
              className="text-lg font-medium tracking-tight text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Flo
            </span>
          </div>
          <h2
            className="text-3xl font-medium text-text-primary tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reset your password
          </h2>
          <p className="text-text-secondary text-sm">
            Enter your new password below.
          </p>
        </div>

        <Card className="bg-[#0F0F10] border-border">
          <div className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs text-text-secondary font-medium">
                        New password
                      </FormLabel>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
                          <Lock size={16} />
                        </span>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="bg-[#1A1A1E] border-border focus:border-primary/50 rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted text-sm h-11"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs text-text-secondary font-medium">
                        Confirm new password
                      </FormLabel>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
                          <Lock size={16} />
                        </span>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="bg-[#1A1A1E] border-border focus:border-primary/50 rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted text-sm h-11"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 rounded-lg text-sm transition-all duration-120 flex items-center justify-center gap-2 cursor-pointer h-11"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset password</span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}