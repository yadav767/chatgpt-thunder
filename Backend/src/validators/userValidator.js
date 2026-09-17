import { z } from "zod";

export const validateRegister = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 2 characters")
        .max(30, "Name must be under 50 characters"),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address"),
    age: z
        .number()
        .min(10, "The age should be minimum 10")
        .max(100)
        .optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})

export const validateLogin = z.object({

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})