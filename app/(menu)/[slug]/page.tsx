import { NextPage } from "next";
import { notFound } from "next/navigation";
import SimpleMenu from "@/components/menu/SimpleMenu/SimpleMenu";
import { publicMenuRepository } from "@/lib/repositories/public-menu-repository";

interface Params {
  params: Promise<{ slug: string }>;
}
export const generateMetadata = async ({ params }: Params) => {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Menu",
      description: "Menu",
    };
  }

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  return {
    title: menu?.cafe.name,
    description: menu?.cafe.description,
  };
};

const Page: NextPage<Params> = async (props) => {
  const { slug } = await props.params;

  console.log("slug", slug);

  if (!slug) {
    notFound();
  }

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  console.log("menu", menu);

  if (!menu) {
    notFound();
  }

  return <SimpleMenu menu={menu} />;
};

export default Page;
