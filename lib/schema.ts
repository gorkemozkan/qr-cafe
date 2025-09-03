import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signupSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const cafeSchema = z.object({
  slug: z.string().min(1, "Slug is required").min(3, "Slug must be at least 3 characters"),
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
