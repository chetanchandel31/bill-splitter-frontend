import { CrownOutlined } from "@ant-design/icons";
import { Checkbox, Skeleton, Spin, Tag } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import styles from "components/expenses/BtnAddNewExpenseV2/stepAddExpense.module.css";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { ReactNode } from "react";
import { User } from "types";

type PropsGroupMembersList = {
  selectedParticipantsId: string[];
  onChange: (event: CheckboxChangeEvent, participant: User) => void;
};

const GroupMembersList = ({
  onChange,
  selectedParticipantsId,
}: PropsGroupMembersList) => {
  const { userInfo } = useAuth();
  const {
    selectedGroupDetails,
    isSelectedGroupLoading,
    isSelectedGroupFetching,
  } = useSelectedGroup();

  let participantsList: ReactNode = null;

  const isAdmin = (userId: string) =>
    !!selectedGroupDetails?.admins.find((admin) => admin._id === userId);

  if (isSelectedGroupLoading) {
    participantsList = (
      <div aria-label="skeletonParticipantsList" role={"progressbar"}>
        <Skeleton paragraph={{ rows: 4 }} />
      </div>
    );
  } else {
    participantsList = selectedGroupDetails?.admins
      .concat(selectedGroupDetails?.members)
      .map((member) => {
        const isSignedInUser = userInfo?.user._id === member._id;
        const isChecked = selectedParticipantsId.some(
          (id) => id === member._id
        );

        return (
          <div
            aria-label="participant"
            className={styles.participantCheckbox}
            key={member.name}
          >
            <Checkbox
              checked={isChecked || isSignedInUser}
              disabled={isSignedInUser}
              onChange={(e) => onChange(e, member)}
            >
              <span>{member.name}</span> ({member.email}){" "}
              {isAdmin(member._id) ? (
                <Tag icon={<CrownOutlined />} color="success">
                  Admin
                </Tag>
              ) : (
                <Tag color="warning">Member</Tag>
              )}
              {isSignedInUser && <Tag>(You)</Tag>}
            </Checkbox>
          </div>
        );
      });
  }

  return (
    <div data-testid="container-select-participants">
      <Spin spinning={isSelectedGroupFetching}>{participantsList}</Spin>
    </div>
  );
};

export default GroupMembersList;
