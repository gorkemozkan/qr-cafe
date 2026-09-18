# AGENTS.md — `components/`

React components. See [`/AGENTS.md`](../AGENTS.md) for repo-wide rules.

## Where a component goes

| Scope | Directory | Naming |
| --- | --- | --- |
| shadcn/ui primitive | `ui/` | lowercase kebab-case, via the CLI |
| used by three or more features | `common/` | PascalCase |
| used by one feature | `<feature>/` | PascalCase |

`ui/` is generated and meant to stay regenerable. Edit a primitive only when the
change is genuinely global; otherwise wrap it in `common/`.

Do not promote a component to `common/` on speculation. Two call sites in the
same feature is not "shared".

## The feature file set

Each feature directory repeats the same roles. Follow them rather than inventing
a new split:

- `*Form` — fields plus validation, driven by React Hook Form and a schema from
  `lib/schema.ts`
- `*List` — the table, built on `common/DataTable`
- `*CreateSheet` / `*EditSheet` / `*Modal` — the container that opens the form
- `*Dropdown` — row actions

`cafe/`, `category/` and `product/` are three worked examples. Copy the closest
one.

## Data

Components do not call `fetch` and do not import a Supabase client. Go through a
repository in `lib/repositories/`, usually via a hook:

```ts
const { data, isLoading } = useQueryRequest({
  queryFn: () => cafeRepository.getById(cafeId),
  queryKey: QueryKeys.cafe(cafeId.toString()),
});
```

Mutations use `useRequest`, which handles the toast, the retry and the
invalidation in one place:

```ts
const { execute, isLoading } = useRequest({
  mutationFn: (values: CafeSchema) => cafeRepository.update(id, values),
  successMessage: t("cafe.updated"),
  invalidateQueries: [QueryKeys.cafes],
});
```

Query keys always come from `lib/query.ts`. An inline key is how invalidation
stops matching.

## Server vs client

The public menu (`app/(menu)/`) renders on the server — `components/menu/` must
stay server-compatible. Admin components are client components.

Add `"use client"` because the component needs state, effects or a browser API,
not by habit. A `"use client"` at the top of a tree pulls everything below it
into the bundle.

## Forms

React Hook Form plus `@hookform/resolvers/zod`, with the schema imported from
`lib/schema.ts` — the same object the route handler validates against. Do not
declare field rules inline; that is how client and server validation drift.

## Strings

Every user-visible string goes through `next-intl`. No hardcoded English or
Turkish in JSX.

Add the key to **both** `messages/en.json` and `messages/tr.json` in the same
change. The catalogues have already diverged (~40 keys exist only in Turkish);
do not make it worse.

## Styling

Tailwind 4 utility classes. Merge conditional classes with `cn()` from
`lib/utils.ts` so later classes actually win:

```tsx
<div className={cn("rounded-md border", isActive && "border-primary")} />
```

Use the theme tokens (`bg-background`, `text-muted-foreground`, `border-border`)
rather than raw colours — dark mode goes through `next-themes` and raw values do
not follow it.

## Accessibility

`ui/` primitives are Radix-based and already handle focus, roles and keyboard
interaction. Keep that when you wrap them: do not replace a Radix trigger with a
bare `div`, and keep `aria-label` on icon-only buttons.
