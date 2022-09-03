import {
  CrownOutlined,
  SendOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  List,
  message,
  Modal,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import Tooltip from "antd/es/tooltip";
import useInviteSend from "api/hooks/invites/useInviteSend";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import Layout from "helpers/Layout";
import { useState } from "react";
import { showErrorMessage } from "utils";
import styles from "./members.module.css";

const Members = () => {
  const { userInfo } = useAuth();
  const {
    selectedGroupDetails,
    isSelectedGroupLoading,
    isSelectedGroupFetching,
  } = useSelectedGroup();
  const allGroupParticipants = [
    ...(selectedGroupDetails?.admins || []),
    ...(selectedGroupDetails?.members || []),
  ];

  const isAdmin = (userId: string) =>
    !!selectedGroupDetails?.admins.find((admin) => admin._id === userId);

  const { mutate, isLoading: isInviteSendLoading } = useInviteSend({
    onError: showErrorMessage,
    onSuccess: (data) => message.success(data.data.message),
  });

  // invite member modal
  const [visible, setVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setNewMemberName("");
  };

  const addNewMember = () => {
    if (typeof selectedGroupDetails?._id === "string") {
      mutate({
        groupId: selectedGroupDetails?._id,
        invitedUserName: newMemberName,
      });
    }
    hideModal();
  };

  return (
    <Layout>
      <div style={{ textAlign: "right", margin: "24px 0" }}>
        <Tooltip
          title={
            !isAdmin(userInfo?.user._id ?? "")
              ? "Only admin can invite members to group"
              : undefined
          }
        >
          <Button
            onClick={showModal}
            type="primary"
            loading={
              isSelectedGroupLoading ||
              isSelectedGroupFetching ||
              isInviteSendLoading
            }
            icon={<UsergroupAddOutlined />}
            disabled={!isAdmin(userInfo?.user._id ?? "")}
          >
            Add new members
          </Button>
        </Tooltip>
      </div>

      {isSelectedGroupLoading && <Skeleton paragraph={{ rows: 4 }} />}

      {!isSelectedGroupLoading && (
        <List
          className="demo-loadmore-list"
          loading={isSelectedGroupFetching || isInviteSendLoading}
          itemLayout="horizontal"
          dataSource={allGroupParticipants}
          renderItem={(participant) => (
            <List.Item>
              <List.Item.Meta
                avatar={<UserOutlined />}
                title={
                  <>
                    {participant.name} ({participant.email}){" "}
                    {participant._id === userInfo?.user._id ? (
                      <Typography.Text code>(you)</Typography.Text>
                    ) : null}
                  </>
                }
              />
              <div>
                {isAdmin(participant._id ?? "") ? (
                  <Tag icon={<CrownOutlined />} color="success">
                    Admin
                  </Tag>
                ) : (
                  <Tag color="warning">Member</Tag>
                )}
              </div>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Invite new members"
        visible={visible}
        onOk={addNewMember}
        okButtonProps={{ disabled: !newMemberName, icon: <SendOutlined /> }}
        onCancel={hideModal}
        okText="Send invite"
        cancelText="Cancel"
      >
        <Input
          onPressEnter={() => {
            if (newMemberName) {
              addNewMember();
            }
          }}
          placeholder="username(case-sensitive) e.g. Joe Biden"
          onChange={({ target }) => setNewMemberName(target.value)}
          value={newMemberName}
        />
        <Typography.Text className={styles.inviteInfo} italic type="warning">
          * each user has unique user name, admins can use it to invite people
          to group
        </Typography.Text>
      </Modal>
    </Layout>
  );
};

export default Members;
