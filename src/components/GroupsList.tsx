import {
  CrownOutlined,
  DeleteOutlined,
  SelectOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Input,
  List,
  message,
  Modal,
  Skeleton,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import useGroupCreate from "api/hooks/groups/useGroupCreate";
import useGroupDelete from "api/hooks/groups/useGroupDelete";
import useGroupsList from "api/hooks/groups/useGroupsList";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { useState } from "react";
import { showErrorMessage } from "utils";
import styles from "./groupsList.module.css";

const GroupsList = () => {
  const { userInfo } = useAuth();
  const { selectGroup } = useSelectedGroup();

  const [visible, setVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setNewGroupName("");
  };

  const { mutate: createGroup, isLoading: isGroupCreateLoading } =
    useGroupCreate({
      onError: showErrorMessage,
      onSuccess: (data) =>
        message.success(
          `new group ${data.data.groupName} created successfully`
        ),
    });

  const {
    data: groupsList,
    isFetching: isGroupsListFetching,
    isLoading: isGroupsListLoading,
  } = useGroupsList({
    onError: showErrorMessage,
  });
  const isGroupsListEmpty = groupsList?.data && groupsList.data.length < 1;
  const isAdmin = (adminsList: string[]) =>
    !!adminsList.find((adminId) => adminId === userInfo?.user._id);

  const { isLoading: isGroupDeleteLoading, mutate: deleteGroup } =
    useGroupDelete({
      onError: showErrorMessage,
      onSuccess: (data) =>
        message.success(`'Group: ${data.data.groupName}' deleted successfully`),
    });

  if (isGroupsListLoading) return <Skeleton paragraph={{ rows: 4 }} />;

  return (
    <div>
      <div className={styles.createGroupContainer}>
        <Button
          icon={<UsergroupAddOutlined />}
          loading={isGroupCreateLoading}
          onClick={showModal}
        >
          Create new group
        </Button>

        <Modal
          title="Create new group"
          visible={visible}
          onOk={() => {
            createGroup({ groupName: newGroupName });
            hideModal();
          }}
          okButtonProps={{ disabled: !newGroupName }}
          onCancel={hideModal}
          okText="Create group"
          cancelText="Cancel"
        >
          <Input
            onPressEnter={() => {
              if (newGroupName) {
                createGroup({ groupName: newGroupName });
                hideModal();
              }
            }}
            placeholder="enter group name"
            onChange={({ target }) => setNewGroupName(target.value)}
            value={newGroupName}
          />
        </Modal>
      </div>

      <Typography className={styles.listDescription}>
        The groups you are currently a part of:
      </Typography>

      {isGroupsListEmpty ? (
        <Empty description="You aren't a part of any groups yet" />
      ) : (
        <Spin
          spinning={
            isGroupsListFetching || isGroupCreateLoading || isGroupDeleteLoading
          }
        >
          <List
            className="demo-loadmore-list"
            // loading={initLoading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={groupsList?.data}
            renderItem={(group) => (
              <List.Item
                actions={[
                  <Tooltip title="Select this group">
                    <Button
                      shape="circle"
                      type="primary"
                      icon={<SelectOutlined />}
                      onClick={() => selectGroup(group._id)}
                    ></Button>
                  </Tooltip>,
                  <Tooltip
                    title={
                      isAdmin(group.admins)
                        ? "Delete this group"
                        : "Only admins can delete the group"
                    }
                  >
                    {/* TODO: confirmation */}
                    <Button
                      danger
                      disabled={!isAdmin(group.admins)}
                      onClick={() => deleteGroup({ groupId: group._id })}
                      shape="circle"
                      type="default"
                      icon={<DeleteOutlined />}
                    ></Button>
                  </Tooltip>,
                ]}
              >
                {/* <Skeleton
              avatar
              title={false}
              //  loading={group.loading}
              active
            > */}
                <List.Item.Meta
                  // avatar={<Avatar src={group.picture.large} />}
                  title={group.groupName}
                  // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
                <div>
                  {isAdmin(group.admins) ? (
                    <Tag icon={<CrownOutlined />} color="success">
                      Admin
                    </Tag>
                  ) : (
                    <Tag color="warning">Member</Tag>
                  )}
                </div>
                {/* </Skeleton> */}
              </List.Item>
            )}
          />
        </Spin>
      )}
    </div>
  );
};

export default GroupsList;
