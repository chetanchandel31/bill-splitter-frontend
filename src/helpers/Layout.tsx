// import {  RadioChangeEvent } from "antd";
// import { useSelectedGroup } from "contexts/group-context";
import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import Header from "components/Header";

// TODO: move to components
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout as AntDLayout, Menu } from "antd";

const { Header: AntdHeader, Content, Footer, Sider } = AntDLayout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "/", <PieChartOutlined />),
  getItem("Option 2", "/invitations", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const Layout = ({ children }: { children: ReactNode }) => {
  // this should be used only for pages after group selection
  // const { selectedGroupDetails } = useSelectedGroup();

  const navigate = useNavigate();
  const location = useLocation();

  // const switchTabs = (e: RadioChangeEvent) => {
  //   navigate(e.target.value);
  // };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* <Header />

      <Radio.Group value={location.pathname} onChange={switchTabs}>
        <Radio.Button value="/">bills</Radio.Button>
        <Radio.Button value="/members">members</Radio.Button>
        <Radio.Button value="/invitations">invitations</Radio.Button>
      </Radio.Group>
      <div>{children}</div> */}
      <AntDLayout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            selectedKeys={[location.pathname]}
            mode="inline"
            items={items}
            onSelect={(info) => navigate(info.key)}
          />
        </Sider>
        <AntDLayout className="site-layout">
          <AntdHeader
            className="site-layout-background"
            style={{ padding: 0 }}
          />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </AntDLayout>
      </AntDLayout>
    </>
  );
};

export default Layout;
