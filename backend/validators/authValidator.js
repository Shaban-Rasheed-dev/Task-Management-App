import { z } from "zod";

export const signUpschema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(255, "NAme must not be graeter than 255 characters"),
  email: z
    .string()
    .trim()
    .email("invalid email")
    .min(1, "Email is required")

    .max(255, "email must not be greater than 255 chars"),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must at least 8  characters")
    .max(1024, "Password can't be greater than 1024  characters"),
});

export const loginschema = z.object({
  email: z
    .string()
    .trim()

    .min(1, "Email is required")
    .email("invalid email")
    .max(255, "email must not be greater than 255 chars"),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must at least 8  characters")
    .max(1024, "Password can't be greater than 1024  characters"),
  rememberMe: z.boolean().optional(),
});
