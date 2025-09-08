-- Fix critical security vulnerability: Remove dangerous anonymous permissions
-- This migration revokes all dangerous permissions from anonymous users while maintaining
-- controlled public access through RLS policies for menu data

-- =============================================
-- CAFES TABLE: Remove dangerous anonymous permissions
-- =============================================

-- Revoke dangerous permissions from anonymous users on cafes table
REVOKE DELETE ON "public"."cafes" FROM "anon";
REVOKE INSERT ON "public"."cafes" FROM "anon";
REVOKE UPDATE ON "public"."cafes" FROM "anon";
REVOKE TRUNCATE ON "public"."cafes" FROM "anon";
REVOKE TRIGGER ON "public"."cafes" FROM "anon";

-- Keep REFERENCES permission for foreign key relationships
-- Keep SELECT permission (controlled by RLS policies)

-- Ensure authenticated users have proper permissions
GRANT DELETE ON "public"."cafes" TO "authenticated";
GRANT INSERT ON "public"."cafes" TO "authenticated";
GRANT SELECT ON "public"."cafes" TO "authenticated";
GRANT UPDATE ON "public"."cafes" TO "authenticated";
GRANT REFERENCES ON "public"."cafes" TO "authenticated";
GRANT TRIGGER ON "public"."cafes" TO "authenticated";

-- =============================================
-- CATEGORIES TABLE: Remove dangerous anonymous permissions
-- =============================================

-- Revoke dangerous permissions from anonymous users on categories table
REVOKE DELETE ON "public"."categories" FROM "anon";
REVOKE INSERT ON "public"."categories" FROM "anon";
REVOKE UPDATE ON "public"."categories" FROM "anon";
REVOKE TRUNCATE ON "public"."categories" FROM "anon";
REVOKE TRIGGER ON "public"."categories" FROM "anon";

-- Keep REFERENCES permission for foreign key relationships
-- Keep SELECT permission (controlled by RLS policies)

-- Ensure authenticated users have proper permissions
GRANT DELETE ON "public"."categories" TO "authenticated";
GRANT INSERT ON "public"."categories" TO "authenticated";
GRANT SELECT ON "public"."categories" TO "authenticated";
GRANT UPDATE ON "public"."categories" TO "authenticated";
GRANT REFERENCES ON "public"."categories" TO "authenticated";
GRANT TRIGGER ON "public"."categories" TO "authenticated";

-- =============================================
-- PRODUCTS TABLE: Remove dangerous anonymous permissions
-- =============================================

-- Revoke dangerous permissions from anonymous users on products table
REVOKE DELETE ON "public"."products" FROM "anon";
REVOKE INSERT ON "public"."products" FROM "anon";
REVOKE UPDATE ON "public"."products" FROM "anon";
REVOKE TRUNCATE ON "public"."products" FROM "anon";
REVOKE TRIGGER ON "public"."products" FROM "anon";

-- Keep REFERENCES permission for foreign key relationships
-- Keep SELECT permission (controlled by RLS policies)

-- Ensure authenticated users have proper permissions
GRANT DELETE ON "public"."products" TO "authenticated";
GRANT INSERT ON "public"."products" TO "authenticated";
GRANT SELECT ON "public"."products" TO "authenticated";
GRANT UPDATE ON "public"."products" TO "authenticated";
GRANT REFERENCES ON "public"."products" TO "authenticated";
GRANT TRIGGER ON "public"."products" TO "authenticated";

-- =============================================
-- VERIFICATION: Ensure service_role retains full access
-- =============================================

-- Ensure service_role has all necessary permissions for admin operations
GRANT ALL ON "public"."cafes" TO "service_role";
GRANT ALL ON "public"."categories" TO "service_role";
GRANT ALL ON "public"."products" TO "service_role";

-- =============================================
-- SECURITY SUMMARY
-- =============================================
-- After this migration:
-- • Anonymous users can only SELECT data (controlled by RLS policies)
-- • Anonymous users cannot INSERT, UPDATE, DELETE, or TRUNCATE any data
-- • Authenticated users have full CRUD access to their own data (via RLS)
-- • Service role retains full admin access
-- • Public menu access is maintained through selective RLS policies
