"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type FC, type ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const QueryProvider: FC<Props> = (props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};

export default QueryProvider;
