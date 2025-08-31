import { createClient } from "@/lib/supabase/client";

const page = async () => {
  const client = createClient();

  const { data, error } = await client.from("cafes").select("*");

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default page;
