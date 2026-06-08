"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Card } from "@/app/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { signupSchema, SignupValues } from "@/modules/sign-up/schema/sign-up.schema";
import { useSignUpHook } from "@/modules/sign-up/hooks/use-sign-up";

export function SignUpPage() {
    const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
    mode: "onSubmit",
  });

  const {
    errorMsg, 
    handleGoogleSignup, 
    loading,
    onSubmit, 
    successMsg, 
    setErrorMsg, 
    setLoading, 
    getPasswordStrength
  } = useSignUpHook();
  
  const password = form.watch("password");
  const strength = getPasswordStrength(password);

  return (
    <div className="w-full min-h-screen flex">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#0F0F10] border-r border-border relative overflow-hidden flex-col justify-between p-12">
        {/* Aurora Glow Gradient */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary rounded-full filter blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-secondary rounded-full filter blur-[150px] mix-blend-screen animate-pulse delay-75" />
        </div>

        {/* Top Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span
            className="text-xl font-medium tracking-tight text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Flo
          </span>
        </div>

        {/* Hero Headline */}
        <div className="my-auto z-10 max-w-md">
          <h1
            className="text-5xl font-semibold leading-tight text-text-primary mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your money,
            <br />finally clear.
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Join Flo today to track your transactions, set budgets, and receive
            monthly, personalized, AI-generated insights.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="text-xs text-text-muted z-10">
          &copy; {new Date().getFullYear()} Flo Finance. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#0F0F10]">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            {/* Logo for mobile */}
            <div className="flex items-center gap-2 md:hidden mb-6">
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
              Create an account
            </h2>
            <p className="text-text-secondary text-sm">
              Sign up to take control of your financial future today.
            </p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="border-destructive/20">
              <AlertTitle className="flex items-center gap-2">
                <span aria-hidden>⚠️</span>
                <span>Error</span>
              </AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert variant="default" className="border-secondary/20">
              <AlertTitle className="flex items-center gap-2">
                <span aria-hidden>✅</span>
                <span>Success</span>
              </AlertTitle>
              <AlertDescription className="text-secondary">
                {successMsg}
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-[#0F0F10] border-border">
            <div className="p-6 sm:p-8">
              <Form {...form}>
                <form
                  onSubmit={() => {
                    try {
                      form.handleSubmit(onSubmit)
                      form.reset();

                    } catch (err: unknown) {
                      console.error("Signup error:", err);
                      setErrorMsg("An unexpected error occurred. Please try again.");
                    }
                    finally {
                      setLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs text-text-secondary font-medium">
                          Full name
                        </FormLabel>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
                            <User size={16} />
                          </span>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Alex Chen"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs text-text-secondary font-medium">
                          Email address
                        </FormLabel>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Mail size={16} />
                          </span>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="name@example.com"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs text-text-secondary font-medium">
                          Password
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

                        {password && (
                          <div className="space-y-1 pt-1">
                            <div className="w-full bg-[#242428] rounded-full h-1">
                              <div
                                className={`h-1 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-text-secondary">
                              <span>Password Strength</span>
                              <span className="font-semibold">
                                {strength.label}
                              </span>
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs text-text-secondary font-medium">
                          Confirm password
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
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <div className="flex items-start gap-2.5 py-1">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) => field.onChange(!!v)}
                              className="mt-1 w-4 h-4 bg-[#1A1A1E] border-border rounded text-primary focus:ring-primary focus:ring-offset-0 focus:outline-none cursor-pointer"
                            />
                          </FormControl>
                          <FormLabel className="text-xs text-text-secondary leading-snug cursor-pointer select-none">
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-primary hover:underline font-medium"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy"
                              className="text-primary hover:underline font-medium"
                            >
                              Privacy Policy
                            </Link>
                            .
                          </FormLabel>
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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Sign up</span>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 border-t border-border" />
                <span className="relative px-3 bg-[#0F0F10] text-xs text-text-muted">
                  Or continue with
                </span>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full bg-[#1A1A1E] border border-border hover:bg-[#242428] text-text-primary font-medium py-3 rounded-lg text-sm transition-all duration-120 flex items-center justify-center gap-2 cursor-pointer h-11"
                variant="outline"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </Button>

              <p className="text-center text-sm text-text-secondary mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}