import { NextPage } from "next";
import { notFound } from "next/navigation";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuSections from "@/components/menu/MenuSections";
import { publicMenuRepository } from "@/lib/repositories/public-menu-repository";

interface Params {
  params: Promise<{ slug: string }>;
}

const Page: NextPage<Params> = async (props) => {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const data = await publicMenuRepository.getMenuBySlug(slug);

  if (!data) {
    notFound();
  }

  const { cafe, categories } = data;

  return (
    <div className="min-h-screen  bg-[#FAF9F2]">
      <div className="max-w-5xl mx-auto px-5 py-6">
        <MenuHeader cafe={cafe} />
        <MenuSections categories={categories} />
      </div>
    </div>
  );
};

export default Page;
