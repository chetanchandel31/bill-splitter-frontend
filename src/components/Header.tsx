import {
  ArrowLeftOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./header.module.css";
import { Button, PageHeader, Popover, Select } from "antd";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";

const { Option } = Select;

const Header = () => {
  const { userInfo, signOut } = useAuth();
  const { doHaveSelectedGroup, selectGroup } = useSelectedGroup();

  return (
    <PageHeader
      // ghost={false}
      style={{ backgroundColor: "#001529", color: "#ececec" }}
      // title="Title"
      // subTitle="This is a subtitle"
    >
      <div className={styles.headerContainer}>
        <Select defaultValue="lucy" style={{ width: 120 }} loading>
          <Option value="lucy">Lucy</Option>
        </Select>

        <Popover
          key="1"
          content={
            <>
              <p>{userInfo?.user.email}</p>
              {doHaveSelectedGroup && (
                <p>
                  <Button
                    block
                    onClick={() => selectGroup(null)}
                    icon={<ArrowLeftOutlined />}
                    size="small"
                    key="1"
                    type="default"
                  >
                    Back to group selection
                  </Button>
                </p>
              )}
              <Button
                block
                danger
                onClick={signOut}
                icon={<LogoutOutlined />}
                // size="small"
                key="1"
                type="primary"
              >
                Logout
              </Button>
            </>
          }
          placement="bottomRight"
          title={"Username: " + userInfo?.user.name}
          trigger="click"
        >
          <Button icon={<UserOutlined />} type="primary"></Button>
        </Popover>
      </div>
    </PageHeader>
  );
};

export default Header;
