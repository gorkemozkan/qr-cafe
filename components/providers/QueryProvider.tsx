"use client";

import { type FC, type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: ReactNode;
}

const QueryProvider: FC<Props> = (props) => {
  // data is not shared between different users only creating query client once per component lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep data in cache for 10 minutes after it becomes unused
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Retry with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus (good for keeping data fresh)
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
            // Retry delay for mutations
            retryDelay: 1000,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};

export default QueryProvider;
