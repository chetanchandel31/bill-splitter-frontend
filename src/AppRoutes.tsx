import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Result } from "antd";
import { AuthProvider } from "contexts/auth-context";
import { GroupProvider } from "contexts/group-context";
import ProtectedRoute from "helpers/ProtectedRoute";
import GroupSelection from "pages/GroupSelection.page";
import Home from "pages/Home.page";
import SignIn from "pages/SignIn.page";
import SignUp from "pages/SignUp.page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// TODO: code splitting for routes
// TODO: turn of refetching on focus of tab
const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <GroupProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/group-selection"
                element={
                  <ProtectedRoute meantFor="authentiactedUserWithoutSelectedGroup">
                    <GroupSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sign-in"
                element={
                  <ProtectedRoute meantFor="unauthenticatedUser">
                    <SignIn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sign-up"
                element={
                  <ProtectedRoute meantFor="unauthenticatedUser">
                    <SignUp />
                  </ProtectedRoute>
                }
              />
              <Route
                element={
                  <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    // extra={<Button type="primary">Back Home</Button>}
                  />
                }
                path="*"
              />
            </Routes>
          </GroupProvider>
        </AuthProvider>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default AppRoutes;
