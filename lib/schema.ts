import { z } from "zod";
import { isDevelopment } from "@/lib/env";
import { sanitizeXSS } from "@/lib/security";

const createCaptchaTokenSchema = () => {
  if (isDevelopment) {
    return z.string();
  }
  return z.string().min(1, "CAPTCHA verification is required");
};

export const loginSchema = z
  .object({
    email: z.email("Please enter a valid email address").min(1).max(254),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(128)
      .refine((data) => {
        try {
          sanitizeXSS(data);
          return true;
        } catch {
          return false;
        }
      }),
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
    email: z.email("Please enter a valid email address").min(1).max(254),
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

const sanitaizedString = (property: string) => {
  return z.string({ message: `${property} is required` }).refine((val) => {
    try {
      sanitizeXSS(val);
      return true;
    } catch {
      return false;
    }
  });
};

export const cafeSchema = z.object({
  name: sanitaizedString("name")
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be no more than 100 characters"),
  description: sanitaizedString("description").optional(),
  logo_url: z.url("Please enter a valid URL").optional().or(z.literal("")),
  currency: z.enum(["TRY", "USD", "EUR"]),
  is_active: z.boolean(),
});

export const categorySchema = z.object({
  name: sanitaizedString("name").min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  description: sanitaizedString("description").min(1, "Description is required"),
  image_url: z.url("Please enter a valid URL").optional().or(z.literal("")),
  is_active: z.boolean(),
  sort_order: z.union([z.string(), z.number().int().min(0)]).optional(),
});

export const productSchema = z.object({
  name: sanitaizedString("name").min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  description: sanitaizedString("description").optional(),
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
