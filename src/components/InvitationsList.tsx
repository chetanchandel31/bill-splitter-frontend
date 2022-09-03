import {
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Button, Empty, List, message, Skeleton, Spin, Tooltip } from "antd";
import useInviteSettle from "api/hooks/invites/useInviteSettle";
import useInvitesList from "api/hooks/invites/useInvitesList";
import { showErrorMessage } from "utils";
import styles from "./invitationsList.module.css";

const InvitationsList = () => {
  const {
    data: invitesList,
    isFetching: isInvitesListFetching,
    isLoading: isInvitesListLoading,
    refetch: refetchInvitesList,
  } = useInvitesList({
    onError: showErrorMessage,
  });

  const isInviteListEmpty = invitesList?.data && invitesList.data.length < 1;

  const { mutate: settleInvite, isLoading: isInviteSettleLoading } =
    useInviteSettle({
      onError: showErrorMessage,
      onSuccess: (data) => message.success(data.data.message),
    });

  if (isInvitesListLoading) return <Skeleton paragraph={{ rows: 4 }} />;

  return (
    <div>
      <div className={styles.refreshBtnContainer}>
        <Tooltip title="Refresh to check for any new invites">
          <Button
            shape="circle"
            onClick={() => refetchInvitesList()}
            loading={isInvitesListFetching}
            icon={<RedoOutlined />}
          ></Button>
        </Tooltip>
      </div>

      {isInviteListEmpty ? (
        <Empty description="You don't have any invites yet" />
      ) : (
        <Spin spinning={isInvitesListFetching || isInviteSettleLoading}>
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={invitesList?.data}
            renderItem={(invite) => (
              <List.Item
                actions={[
                  <Tooltip title="Accept invitation">
                    <Button
                      color="success"
                      shape="circle"
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() =>
                        settleInvite({ inviteId: invite._id, doReject: false })
                      }
                    ></Button>
                  </Tooltip>,
                  <Tooltip title={"Reject invitation"}>
                    <Button
                      danger
                      onClick={() =>
                        settleInvite({ inviteId: invite._id, doReject: true })
                      }
                      shape="circle"
                      type="default"
                      icon={<CloseOutlined />}
                    ></Button>
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={<MailOutlined />}
                  title={
                    <>
                      <strong>Invitation to: </strong>
                      {invite.invitedTo.groupName}
                    </>
                  }
                  description={
                    <>
                      <strong>
                        {invite.invitedBy.name} ({invite.invitedBy.email})
                      </strong>{" "}
                      is inviting you to join the group named
                      <strong> {invite.invitedTo.groupName}</strong>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      )}
    </div>
  );
};

export default InvitationsList;
