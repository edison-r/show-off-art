import { z } from "zod";

const RESERVED_USERNAMES = new Set([
  "admin", "root", "support", "api", "www", "u", "auth", 
  "login", "register", "signup", "app", "dashboard"
]);

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(24, "Max 24 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, _ and -")
    .refine(
      (val) => !RESERVED_USERNAMES.has(val.toLowerCase()),
      "This username is not available"
    ),
  display_name: z
    .string()
    .min(2, "Min 2 characters")
    .max(80, "Max 80 characters")
    .trim(),
  accept_terms: z.literal(true, { message: "You must accept the terms" }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;