import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  meantFor?:
    | "unauthenticatedUser"
    | "authentiactedUserWithoutSelectedGroup"
    | "authenticatedUserWithSelectedGroup";
};

const ProtectedRoute = ({
  children,
  meantFor = "authenticatedUserWithSelectedGroup",
}: ProtectedRouteProps) => {
  const { userInfo } = useAuth();
  const { doHaveSelectedGroup } = useSelectedGroup();

  const isNoGroupSelected = !doHaveSelectedGroup;

  const isLoggedIn = userInfo !== null;
  let doRedirect;

  let redirectUrl = "";

  if (meantFor === "unauthenticatedUser") {
    // eg signin, signup pages , protect from: visit after signin
    doRedirect = isLoggedIn;
    redirectUrl = "/group-selection";
  } else if (meantFor === "authentiactedUserWithoutSelectedGroup") {
    // eg group-selection page, protect from: 1. visit w/o signin 2. visit with selected group
    doRedirect = !isLoggedIn || !isNoGroupSelected;
    redirectUrl = !isLoggedIn ? "/sign-in" : "/";
  } else if (meantFor === "authenticatedUserWithSelectedGroup") {
    // eg rest of app, after group selection. protect from: 1. visit w/o signin 2. visit w/o selected group
    doRedirect = !isLoggedIn || isNoGroupSelected;
    redirectUrl = isNoGroupSelected ? "/group-selection" : "/sign-in";
  }

  return <>{doRedirect ? <Navigate replace to={redirectUrl} /> : children}</>;
};

export default ProtectedRoute;
