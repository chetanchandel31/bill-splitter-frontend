import { Button, Typography } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme";
import ProtectedRoute from "./helpers/ProtectedRoute";
import SignIn from "./pages/SignIn.page";
import SignUp from "./pages/SignUp.page";

// TODO: code splitting for routes
const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  home
                  <Button color="success" variant="soft">
                    hi
                  </Button>
                </>
              }
            />
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
            <Route
              element={<Typography>{`could not find this page :(`}</Typography>}
              path="*"
            />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default AppRoutes;
