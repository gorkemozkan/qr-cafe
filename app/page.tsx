"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

const page = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const client = createClient();
    client
      .from("cafes")
      .select("*")
      .then(({ data, error }) => {
        setData(data);
        setError(error);
      });
  }, []);

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
