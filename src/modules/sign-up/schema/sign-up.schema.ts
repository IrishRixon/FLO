import z from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .max(120, "Full name is too long"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
    termsAccepted: z
      .boolean()
      .refine((v) => v === true, "You must agree to the Terms of Service"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupValues = z.infer<typeof signupSchema>;