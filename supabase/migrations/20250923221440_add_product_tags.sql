-- Add tags column to products table
-- This will be an array of strings to store product tags like "New", "Favorites", "Chef Special"
ALTER TABLE "public"."products" ADD COLUMN tags TEXT[];
