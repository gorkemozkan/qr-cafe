import { z } from "zod";
import { isDevelopment } from "@/lib/env";

const xssPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
  /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*<\/img>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:/gi,
  /on\w+\s*=/gi,
  /alert\s*\(/gi,
  /eval\s*\(/gi,
  /document\./gi,
  /window\./gi,
  /location\./gi,
  /cookie/gi,
  /%3C/gi,
  /%3E/gi,
  /<[^>]*>/g,
];

const containsXSS = (value: string): boolean => {
  if (typeof value !== "string") return false;
  return xssPatterns.some((pattern) => pattern.test(value));
};

const sanitizeXSS = (value: string) => {
  if (typeof value !== "string") return value;

  if (containsXSS(value)) {
    throw new Error("Input contains potentially dangerous content");
  }

  const sanitized = value
    .replace(/<[^>]*>/g, "") // Remove any HTML tags
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();

  return sanitized;
};

const createCaptchaTokenSchema = () => {
  if (isDevelopment) {
    return z.string();
  }
  return z.string().min(1, "CAPTCHA verification is required");
};

export const loginSchema = z
  .object({
    email: z.email("Please enter a valid email address").min(1).max(254),
    password: z.string().min(6, "Password must be at least 6 characters long").max(128),
    captchaToken: createCaptchaTokenSchema(),
  })
  .refine(
    (data) => {
      try {
        sanitizeXSS(data.email);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Email contains potentially dangerous XSS content",
      path: ["email"],
    },
  );

export const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address").min(1).max(254),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(6).max(128),
    captchaToken: createCaptchaTokenSchema(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      try {
        sanitizeXSS(data.email);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Email contains potentially dangerous XSS content",
      path: ["email"],
    },
  );

export const cafeSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters").max(100, "Name must be no more than 100 characters"),
  description: z.string().optional(),
  logo_url: z.url("Please enter a valid URL").optional().or(z.literal("")),
  currency: z.enum(["TRY", "USD", "EUR"]),
  is_active: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  is_active: z.boolean(),
  sort_order: z.union([z.string(), z.number().int().min(0)]).optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  image_url: z.url("Please enter a valid URL").optional().or(z.literal("")),
  is_available: z.boolean(),
  category_id: z.number().min(1, "Category is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type CafeSchema = z.infer<typeof cafeSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;
export type ProductSchema = z.infer<typeof productSchema>;
