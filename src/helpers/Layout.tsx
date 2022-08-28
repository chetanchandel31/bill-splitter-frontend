import { useSelectedGroup } from "contexts/group-context";
import { ReactNode } from "react";
import Header from "./Header";

const Layout = ({ children }: { children: ReactNode }) => {
  // this should be used only for pages after group selection
  const { selectedGroupDetails } = useSelectedGroup();

  return (
    <>
      <Header />
      <h2>{selectedGroupDetails?.groupName}</h2>
      {children}
    </>
  );
};

export default Layout;
