import {
  ArrowLeftOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, PageHeader, Popover, Select, Typography } from "antd";
import useGroupsList from "api/hooks/groups/useGroupsList";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { showErrorMessage } from "utils";
import styles from "./header.module.css";

const { Option } = Select;

const Header = () => {
  const { userInfo, signOut } = useAuth();

  const {
    doHaveSelectedGroup,
    isSelectedGroupFetching,
    selectGroup,
    selectedGroupDetails,
  } = useSelectedGroup();

  const { data: groupsList, isFetching: isGroupsListLoading } = useGroupsList({
    onError: showErrorMessage,
  });

  // TODO: try to make it fixed header

  return (
    <PageHeader style={{ backgroundColor: "#001529" }}>
      <div className={styles.headerContainer}>
        <div className={styles.groupSelector}>
          {doHaveSelectedGroup && (
            <>
              <Typography style={{ color: "#ececec" }}>
                Selected group:
              </Typography>
              <Select
                loading={isGroupsListLoading || isSelectedGroupFetching}
                onChange={(value) => selectGroup(value)}
                style={{ width: 120 }}
                value={selectedGroupDetails?._id} // TODO: value becomes undefined for couple sec after selecting group, can do a better implementation
              >
                {groupsList?.data.map((group) => (
                  <Option key={group._id} value={group._id}>
                    {group.groupName}
                  </Option>
                ))}
              </Select>
            </>
          )}
        </div>

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
          title={
            <>
              <strong>Username: </strong>
              <Typography.Text copyable>{userInfo?.user.name}</Typography.Text>
            </>
          }
          trigger="click"
        >
          <Button icon={<UserOutlined />} type="primary"></Button>
        </Popover>
      </div>
    </PageHeader>
  );
};

export default Header;
