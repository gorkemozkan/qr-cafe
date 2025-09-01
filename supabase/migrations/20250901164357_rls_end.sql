create type "public"."Currency" as enum ('TRY', 'USD', 'EUR');

alter table "public"."cafes" add column "currency" "Currency" default 'TRY'::"Currency";

alter table "public"."cafes" add column "description" text;

alter table "public"."cafes" add column "is_active" boolean not null default true;

alter table "public"."cafes" add column "logo_url" text;

alter table "public"."categories" add column "cafe_id" bigint not null;

alter table "public"."categories" add column "description" text not null;

alter table "public"."categories" add column "is_active" boolean not null default true;

alter table "public"."categories" add column "name" text not null;

alter table "public"."categories" add column "sort_order" smallint;

alter table "public"."categories" add column "user_id" uuid not null;

alter table "public"."products" add column "cafe_id" bigint not null;

alter table "public"."products" add column "category_id" bigint not null;

alter table "public"."products" add column "description" text;

alter table "public"."products" add column "image_url" text;

alter table "public"."products" add column "is_available" boolean not null default true;

alter table "public"."products" add column "name" text not null;

alter table "public"."products" add column "price" numeric;

alter table "public"."products" add column "user_id" uuid not null;

alter table "public"."categories" add constraint "categories_cafe_id_fkey" FOREIGN KEY (cafe_id) REFERENCES cafes(id) not valid;

alter table "public"."categories" validate constraint "categories_cafe_id_fkey";

alter table "public"."categories" add constraint "categories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."categories" validate constraint "categories_user_id_fkey";

alter table "public"."products" add constraint "products_cafe_id_fkey" FOREIGN KEY (cafe_id) REFERENCES cafes(id) not valid;

alter table "public"."products" validate constraint "products_cafe_id_fkey";

alter table "public"."products" add constraint "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."products" validate constraint "products_category_id_fkey";

alter table "public"."products" add constraint "products_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."products" validate constraint "products_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."categories"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."categories"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for users based on user_id"
on "public"."categories"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."categories"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."products"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."products"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for users based on user_id"
on "public"."products"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."products"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));




