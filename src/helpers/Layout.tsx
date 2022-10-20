import {
  MailOutlined,
  PieChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout as AntDLayout, Menu } from "antd";
import Header from "components/Header";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./layout.module.css";

const { Content, Sider } = AntDLayout;

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
  getItem("Expenses", "sub1", <PieChartOutlined />, [
    getItem("Groups Expenses", "/"),
    getItem("Personal Expenses", "/personal-expenses"),
  ]),
  getItem("Members", "/members", <TeamOutlined />),
  getItem("Invitations", "/invitations", <MailOutlined />),
];

const Layout = ({ children }: { children: ReactNode }) => {
  // this should be used only for pages after group selection

  const navigate = useNavigate();
  const location = useLocation();

  const doExpandExpensesOnInitialRender =
    location.pathname === "/" || location.pathname === "/personal-expenses";

  // antd's layout component jumps on first render :(
  // TODO: footer?
  return (
    <>
      <div className={styles.layoutContainer}>
        <div>
          <Sider
            breakpoint="md"
            collapsedWidth="50"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className={styles.sideBarGutter} />
            <Menu
              // theme="dark"
              defaultSelectedKeys={[location.pathname]}
              defaultOpenKeys={doExpandExpensesOnInitialRender ? ["sub1"] : []}
              selectedKeys={[location.pathname]}
              mode="inline"
              items={items}
              onSelect={(info) => navigate(info.key)}
            />
          </Sider>
        </div>

        <div className={styles.rightPanel}>
          <Header />
          <Content className="site-layout" style={{ margin: "0 16px" }}>
            <div
              className={`site-layout-background ${styles.contentContainer}`}
            >
              {children}
            </div>
          </Content>
        </div>
      </div>
    </>
  );
};

export default Layout;
