import { NextPage } from "next";
import SimpleMenu from "@/components/menu/SimpleMenu/SimpleMenu";
import { notFound } from "next/navigation";
import { publicMenuRepository } from "@/lib/repositories";

interface Params {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: Params) => {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  return {
    title: menu?.cafe.name || "Menu",
    description: menu?.cafe.description || "Menu",
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

  return <SimpleMenu menu={menu} />;
};

export default Page;
