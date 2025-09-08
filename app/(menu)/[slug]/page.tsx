import { NextPage } from "next";
import { publicMenuRepository } from "@/lib/repositories/public-menu-repository";

interface Params {
  params: Promise<{ slug: string }>;
}

const Page: NextPage<Params> = async (props) => {
  const { slug } = await props.params;

  console.log("slug", slug);

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  console.log("menu", menu);

  return <div>menu</div>;
};

export default Page;
