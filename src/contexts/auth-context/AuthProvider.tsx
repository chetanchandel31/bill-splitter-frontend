import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "types";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const userInfoInitialValue = localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt") as string)
    : null;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(
    userInfoInitialValue
  );

  const navigate = useNavigate();

  // things that need to happen
  // 0. network req
  // 1. change state
  // 2. set local storage
  // 3. redirect

  const signIn = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
    localStorage.setItem("jwt", JSON.stringify(userInfo));
    navigate("/");
  };

  const signOut = () => {
    setUserInfo(null);
    localStorage.removeItem("jwt");
    navigate("/sign-in");
  };

  return (
    // problem: whenever component renders, value object will change and context will run unnecessarily
    // justification: this component can only re-render when `userInfo` changes and we *want* context to re-render in such case
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ signIn, signOut, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
