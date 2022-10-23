import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "contexts/auth-context";
import { GroupProvider } from "contexts/group-context";
import { ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const AllProviders = ({ children }: { children: ReactNode }) => {
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
