import { NextPage, Metadata } from "next";
import { notFound } from "next/navigation";
import SimpleMenu from "@/components/menu/SimpleMenu/SimpleMenu";
import { publicMenuRepository, PublicMenuData } from "@/lib/repositories/public-menu-repository";
import { nextPublicBaseUrl } from "@/lib/env";

interface Params {
  params: Promise<{ slug: string }>;
}

function generateStructuredData(menu: PublicMenuData): string {
  const baseUrl = nextPublicBaseUrl;

  const menuUrl = `${baseUrl}/menu/${menu.cafe.slug}`;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: menu.cafe.name,
    description: menu.cafe.description,
    url: menuUrl,
    logo: menu.cafe.logo_url ? `${baseUrl}${menu.cafe.logo_url}` : undefined,
    menu: {
      "@type": "Menu",
      name: `${menu.cafe.name} Menu`,
      hasMenuSection: menu.categories.map((category) => ({
        "@type": "MenuSection",
        name: category.name,
        description: category.description,
        hasMenuItem: category.products.map((product) => ({
          "@type": "MenuItem",
          name: product.name,
          description: product.description || undefined,
          offers: product.price
            ? {
                "@type": "Offer",
                price: product.price.toString(),
                priceCurrency: menu.cafe.currency || "USD",
                availability: product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              }
            : undefined,
        })),
      })),
    },
    servesCuisine: "Various",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
  });
}

function generateSEOTitle(menu: PublicMenuData): string {
  const cafeName = menu.cafe.name;

  const categoryCount = menu.categories.length;

  const productCount = menu.categories.reduce((total, cat) => total + cat.products.length, 0);

  if (categoryCount === 0) {
    return `${cafeName} - Menü`;
  }

  const categoryNames = menu.categories
    .slice(0, 3)
    .map((cat) => cat.name)
    .join(", ");
  return `${cafeName} Menü - ${categoryNames}${categoryCount > 3 ? " & More" : ""} (${productCount} items)`;
}

function generateSEODescription(menu: PublicMenuData): string {
  const cafeName = menu.cafe.name;
  const description = menu.cafe.description;

  if (!description && menu.categories.length === 0) {
    return `View the menu for ${cafeName}. Browse our selection of delicious food and beverages.`;
  }

  if (!description) {
    const categoryNames = menu.categories
      .slice(0, 2)
      .map((cat) => cat.name.toLowerCase())
      .join(" and ");
    const productCount = menu.categories.reduce((total, cat) => total + cat.products.length, 0);
    return `Explore ${cafeName}'s menu featuring ${categoryNames}${menu.categories.length > 2 ? " and more" : ""}. ${productCount} delicious items to choose from.`;
  }

  const truncatedDesc = description.length > 120 ? description.substring(0, 120) + "..." : description;
  return `${truncatedDesc} | ${cafeName} Menu`;
}

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  if (!menu) {
    return {
      title: "Menu Not Found",
      description: "The requested menu could not be found.",
    };
  }

  const title = generateSEOTitle(menu);

  const description = generateSEODescription(menu);

  const baseUrl = nextPublicBaseUrl as string;

  const menuUrl = `${baseUrl}/${menu.cafe.slug}`;

  return {
    title,
    description,
    keywords: [
      menu.cafe.name,
      "menu",
      "restaurant",
      "food",
      "cafe",
      ...menu.categories.map((cat) => cat.name.toLowerCase()),
      "dining",
      "cuisine",
    ].join(", "),
    authors: [{ name: menu.cafe.name }],
    creator: menu.cafe.name,
    publisher: menu.cafe.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: menuUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "article:author": menu.cafe.name,
    },
  };
};

const Page: NextPage<Params> = async (props) => {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const menu = await publicMenuRepository.getMenuBySlug(slug);
  if (!menu) {
    notFound();
  }

  const structuredData = generateStructuredData(menu);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredData,
        }}
        suppressHydrationWarning
      />
      <SimpleMenu menu={menu} />
    </>
  );
};

export default Page;
