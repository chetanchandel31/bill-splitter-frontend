import { Radio, RadioChangeEvent } from "antd";
import { useSelectedGroup } from "contexts/group-context";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";

// TODO: move to components
const Layout = ({ children }: { children: ReactNode }) => {
  // this should be used only for pages after group selection
  const { selectedGroupDetails } = useSelectedGroup();

  const navigate = useNavigate();
  const location = useLocation();

  const switchTabs = (e: RadioChangeEvent) => {
    navigate(e.target.value);
  };

  return (
    <>
      <Header />

      <h2>{selectedGroupDetails?.groupName}</h2>

      <Radio.Group value={location.pathname} onChange={switchTabs}>
        <Radio.Button value="/">bills</Radio.Button>
        <Radio.Button value="/members">members</Radio.Button>
        <Radio.Button value="/invitations">invitations</Radio.Button>
        {/* <Radio.Button value="right">right</Radio.Button> */}
      </Radio.Group>
      <div>{children}</div>
    </>
  );
};

export default Layout;
