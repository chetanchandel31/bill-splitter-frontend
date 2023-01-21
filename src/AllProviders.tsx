import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "contexts/auth-context";
import { GroupProvider } from "contexts/group-context";
import { ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { isTestingEnv } from "utils";

const AllProviders = ({ children }: { children: ReactNode }) => {
  // very imp: keeping `queryClient` outside the component led to leaky tests,
  // data fetched in one test was available in another test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      error: isTestingEnv() ? () => {} : console.error,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <GroupProvider>{children}</GroupProvider>
        </AuthProvider>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AllProviders;
