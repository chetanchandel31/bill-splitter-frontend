import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  protectFrom?: "authenticatedUser" | "unauthenticatedUser";
};

const ProtectedRoute = ({
  children,
  protectFrom = "unauthenticatedUser",
}: ProtectedRouteProps) => {
  const isLoggedIn = false; // TODO: real check
  const doRedirect =
    (isLoggedIn && protectFrom === "authenticatedUser") ||
    (!isLoggedIn && protectFrom === "unauthenticatedUser");

  const redirectUrl = protectFrom === "authenticatedUser" ? "/" : "/sign-in";

  return <>{doRedirect ? <Navigate replace to={redirectUrl} /> : children}</>;
};

export default ProtectedRoute;
