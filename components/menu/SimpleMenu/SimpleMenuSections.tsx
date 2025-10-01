"use client";

import { FC, useEffect, useRef } from "react";
import SimpleMenuCategoryHeader from "@/components/menu/SimpleMenu/SimpleMenuCategoryHeader";
import SimpleMenuNullCase from "@/components/menu/SimpleMenu/SimpleMenuNullCase";
import SimpleMenuProduct from "@/components/menu/SimpleMenu/SimpleMenuProduct";

import { PublicCategory } from "@/lib/repositories/public-menu-repository";

interface Props {
  categories: PublicCategory[];
  currency: string | null;
  onCategoryInView?: (categoryId: number) => void;
}

const SimpleMenuSections: FC<Props> = (props = { categories: [], currency: null }) => {
  const activeCategories = props.categories.filter((category) => category.products.length > 0);

  const categoryRefs = useRef<Map<number, HTMLElement>>(new Map());

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!props.onCategoryInView) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const timeoutId = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter((entry) => entry.isIntersecting);
          if (visibleEntries.length === 0) return;

          const mostVisible = visibleEntries.reduce((prev, current) =>
            prev.intersectionRatio > current.intersectionRatio ? prev : current,
          );

          const categoryId = parseInt(mostVisible.target.getAttribute("data-category-id") || "0");

          if (categoryId && props.onCategoryInView) {
            props.onCategoryInView(categoryId);
          }
        },
        {
          root: null,
          rootMargin: "-100px 0px -20% 0px",
          threshold: 0.3,
        },
      );

      categoryRefs.current.forEach((ref) => {
        if (ref && observerRef.current) {
          observerRef.current.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [props.onCategoryInView]);

  useEffect(() => {
    if (!observerRef.current) return;

    observerRef.current.disconnect();

    categoryRefs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });
  }, [activeCategories]);

  if (activeCategories.length === 0) {
    return <SimpleMenuNullCase />;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 mt-8">
      <div className="space-y-6">
        {activeCategories.map((category) => (
          <section
            key={category.id}
            ref={(el) => {
              if (el) {
                categoryRefs.current.set(category.id, el);

                if (observerRef.current) {
                  observerRef.current.observe(el);
                }
              } else {
                if (observerRef.current && categoryRefs.current.has(category.id)) {
                  const element = categoryRefs.current.get(category.id);
                  if (element) {
                    observerRef.current.unobserve(element);
                  }
                }
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
