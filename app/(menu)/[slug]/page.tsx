import Script from "next/script";
import { NextPage, Metadata } from "next";
import { notFound } from "next/navigation";
import { nextPublicBaseUrl } from "@/lib/env";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import SimpleMenu from "@/components/menu/SimpleMenu/SimpleMenu";
import { publicMenuRepository, PublicMenuData } from "@/lib/repositories/public-menu-repository";

interface Params {
  params: Promise<{ slug: string }>;
}

const generateStructuredData = (menu: PublicMenuData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: menu.cafe.name,
    servesCuisine: "Various",
    description: menu.cafe.description,
    url: `${nextPublicBaseUrl}/${menu.cafe.slug}`,
    logo: menu.cafe.logo_url,
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
          description: product.description,
          offers: product.price
            ? {
                "@type": "Offer",
                price: product.price.toString(),
                priceCurrency: menu.cafe.currency || "TRY",
                availability: product.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              }
            : undefined,
        })),
      })),
    },
  };
};

const generateSEOTitle = (menu: PublicMenuData) => {
  const categoryCount = menu.categories.length;

  const productCount = menu.categories.reduce((total, cat) => total + cat.products.length, 0);

  if (categoryCount === 0) {
    return `${menu.cafe.name} - Menu`;
  }

  const categoryNames = menu.categories
    .slice(0, 3)
    .map((cat) => cat.name)
    .join(", ");

  return `${menu.cafe.name} Menü - ${categoryNames}${categoryCount > 3 ? " & More" : ""} (${productCount} items)`;
};

const generateSEODescription = (menu: PublicMenuData) => {
  if (!menu.cafe.description && menu.categories.length === 0) {
    return `View the menu for ${menu.cafe.name}. Browse our selection of delicious food and beverages.`;
  }

  if (!menu.cafe.description) {
    const categoryNames = menu.categories
      .slice(0, 2)
      .map((cat) => cat.name.toLowerCase())
      .join(" and ");
    const productCount = menu.categories.reduce((total, cat) => total + cat.products.length, 0);
    return `Explore ${menu.cafe.name}'s menu featuring ${categoryNames}${menu.categories.length > 2 ? " and more" : ""}. ${productCount} delicious items to choose from.`;
  }

  const truncatedDesc =
    menu.cafe.description.length > 120 ? `${menu.cafe.description.substring(0, 120)}...` : menu.cafe.description;

  return `${truncatedDesc} | ${menu.cafe.name} Menu`;
};

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const { slug } = await params;

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  if (!menu) {
    return {
      title: "Menu Not Found",
      description: "The requested menu could not be found.",
    };
  }

  const title = generateSEOTitle(menu);

  const description = generateSEODescription(menu);

  const menuUrl = `${nextPublicBaseUrl}/${menu.cafe.slug}`;

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
    metadataBase: new URL(nextPublicBaseUrl),
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

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  if (!menu) {
    notFound();
  }

  return (
    <>
      <Script id="menu-structured-data" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(generateStructuredData(menu))}
      </Script>
      <ErrorBoundary>
        <SimpleMenu menu={menu} />
      </ErrorBoundary>
    </>
  );
};

export default Page;
