alter table "public"."cafes" drop constraint "cafes_slug_unique";

drop index if exists "public"."cafes_slug_idx";

drop index if exists "public"."cafes_slug_unique";

alter table "public"."cafes" alter column "slug" set not null;



