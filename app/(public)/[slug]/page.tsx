import { NextPage } from "next";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Page: NextPage<Props> = async (props) => {
  const { slug } = await props.params;
  console.log(slug);

  const supabase = await createClient();

  const cafe = await supabase.from("cafes").select("*");
  console.log("cafe", cafe);

  return null;
};

export default Page;
