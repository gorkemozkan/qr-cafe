import { publicMenuRepository, PublicMenuData } from "@/lib/repositories/public-menu-repository";
import { notFound } from "next/navigation";
import { nextPublicBaseUrl } from "@/lib/env";
import SimpleMenu from "@/components/menu/SimpleMenu/SimpleMenu";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Script from "next/script";
import { NextPage, Metadata } from "next";

function validateMenuData(menu: any): menu is PublicMenuData {
  if (!menu || typeof menu !== "object") {
    return false;
  }

  if (!menu.cafe || typeof menu.cafe !== "object") {
    return false;
  }

  if (!menu.cafe.name || typeof menu.cafe.name !== "string") {
    return false;
  }

  if (!menu.cafe.slug || typeof menu.cafe.slug !== "string") {
    return false;
  }

  if (!Array.isArray(menu.categories)) {
    return false;
  }

  // Validate categories structure
  for (const category of menu.categories) {
    if (!category || typeof category !== "object") {
      return false;
    }
    if (!category.name || typeof category.name !== "string") {
      return false;
    }
    if (typeof category.id !== "number") {
      return false;
    }
    if (!Array.isArray(category.products)) {
      return false;
    }
  }

  return true;
}

interface Params {
  params: Promise<{ slug: string }>;
}

function generateStructuredData(menu: PublicMenuData) {
  const baseUrl = nextPublicBaseUrl;

  const menuUrl = `${baseUrl}/menu/${menu.cafe.slug}`;

  return {
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
  };
}

/* function generateSEOTitle(menu: PublicMenuData): string {
  const cafeName = menu.cafe.name;

  const categoryCount = menu.categories.length;

  const productCount = menu.categories.reduce((total, cat) => total + cat.products.length, 0);

  if (categoryCount === 0) {
    return `${cafeName} - Menu`;
  }

  const categoryNames = menu.categories
    .slice(0, 3)
    .map((cat) => cat.name)
    .join(", ");
  return `${cafeName} Menü - ${categoryNames}${categoryCount > 3 ? " & More" : ""} (${productCount} items)`;
} */

/* function generateSEODescription(menu: PublicMenuData): string {
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
} */

/* export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  try {
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

    if (!validateMenuData(menu)) {
      console.error("Invalid menu data structure:", menu);
      return {
        title: "Menu Error",
        description: "There was an issue loading the menu.",
      };
    }

    const title = generateSEOTitle(menu);

    const description = generateSEODescription(menu);

    const baseUrl = nextPublicBaseUrl as string;

    const menuUrl = `${baseUrl}/menu/${menu.cafe.slug}`;

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
  } catch (error) {
    console.error("Error generating metadata for menu:", error);
    return {
      title: "Menu",
      description: "View our menu",
    };
  }
}; */

const Page: NextPage<Params> = async (props) => {
  try {
    const { slug } = await props.params;

    if (!slug) {
      console.error("Menu page: No slug provided");
      notFound();
    }

    const menu = await publicMenuRepository.getMenuBySlug(slug);
    if (!menu) {
      console.error(`Menu page: No menu found for slug: ${slug}`);
      notFound();
    }

    // Validate menu structure
    if (!validateMenuData(menu)) {
      console.error(`Menu page: Invalid menu data structure for slug: ${slug}`, menu);
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
  } catch (error) {
    console.error("Menu page error:", error);
    notFound();
  }
};

export default Page;
