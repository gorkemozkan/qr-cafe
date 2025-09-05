import { NextPage } from "next";
import { notFound } from "next/navigation";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuSections from "@/components/menu/MenuSections";
import ScrollToTop from "@/components/menu/ScrollToTop";
import { publicMenuRepository } from "@/lib/repositories/public-menu-repository";

interface Params {
  params: Promise<{ slug: string }>;
}

const Page: NextPage<Params> = async (props) => {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  if (!menu) {
    notFound();
  }

  return (
    <div className="min-h-screen ">
      <div className="bg-white text-foreground">
        <div className="max-w-4xl mx-auto px-2 py-6">
          <MenuHeader />
          <MenuSections categories={menu.categories} />
        </div>
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Page;
