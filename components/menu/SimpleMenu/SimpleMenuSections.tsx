"use client";

import { FC, useEffect, useRef } from "react";
import SimpleMenuCategoryHeader from "@/components/menu/SimpleMenu/SimpleMenuCategoryHeader";
import SimpleMenuNullCase from "@/components/menu/SimpleMenu/SimpleMenuNullCase";
import SimpleMenuProduct from "@/components/menu/SimpleMenu/SimpleMenuProduct";

import { PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Props {
  categories: PublicCategory[];
  currency: string | null;
  selectedCategoryId?: number | null;
  onCategoryInView?: (categoryId: number) => void;
}

const SimpleMenuSections: FC<Props> = (props = { categories: [], currency: null, selectedCategoryId: null }) => {
  const activeCategories = props.categories.filter((category) => category.products.length > 0);

  // Filter categories based on selected category
  const filteredCategories = props.selectedCategoryId
    ? activeCategories.filter((category) => category.id === props.selectedCategoryId)
    : activeCategories;

  // Refs for category sections
  const categoryRefs = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    if (!props.onCategoryInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const mostVisible = visibleEntries.reduce((prev, current) => (prev.intersectionRatio > current.intersectionRatio ? prev : current));

        // Extract category ID from the element's data attribute
        const categoryId = parseInt(mostVisible.target.getAttribute("data-category-id") || "0");
        if (categoryId && props.onCategoryInView) {
          props.onCategoryInView(categoryId);
        }
      },
      {
        root: null,
        rootMargin: "-80px 0px -50% 0px", // Trigger when category is near the top
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    );

    // Observe all category sections
    categoryRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [props.onCategoryInView, filteredCategories]);

  if (filteredCategories.length === 0) {
    return <SimpleMenuNullCase />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 mt-8">
      <div className="space-y-6">
        {filteredCategories.map((category) => (
          <section
            key={category.id}
            ref={(el) => {
              if (el) {
                categoryRefs.current.set(category.id, el);
              } else {
                categoryRefs.current.delete(category.id);
              }
            }}
            data-category-id={category.id}
          >
            <SimpleMenuCategoryHeader category={category} />
            <div>
              {category.products.map((product) => (
                <SimpleMenuProduct key={product.id} product={product} currency={props.currency} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default SimpleMenuSections;
