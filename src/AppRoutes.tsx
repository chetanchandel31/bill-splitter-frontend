import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProtectedRoute from "helpers/ProtectedRoute";
import SignIn from "pages/SignIn.page";
import SignUp from "pages/SignUp.page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// TODO: code splitting for routes
const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<>home</>} />
          <Route
            path="/sign-in"
            element={
              <ProtectedRoute protectFrom="authenticatedUser">
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <ProtectedRoute protectFrom="authenticatedUser">
                <SignUp />
              </ProtectedRoute>
            }
          />
          <Route element={<h2>{`could not find this page :(`}</h2>} path="*" />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default AppRoutes;
