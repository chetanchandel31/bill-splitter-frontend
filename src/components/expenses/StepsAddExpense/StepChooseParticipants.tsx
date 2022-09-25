import { CrownOutlined } from "@ant-design/icons";
import { Checkbox, Skeleton, Spin, Tag, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { Dispatch } from "react";
import { actionTypeNewExpenseMeta } from "./state/actions";
import { NewExpenseMeta } from "./state/reducers";
import styles from "./stepAddExpense.module.css";

type StepChooseParticipantsProps = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const StepChooseParticipants = ({
  dispatch,
  newExpenseMeta,
}: StepChooseParticipantsProps) => {
  const { userInfo } = useAuth();

  const {
    isSelectedGroupFetching,
    isSelectedGroupLoading,
    selectedGroupDetails,
  } = useSelectedGroup();

  const totalParticipants = [
    ...(selectedGroupDetails?.admins || []),
    ...(selectedGroupDetails?.members || []),
  ];

  const { selectedParticipantsId } = newExpenseMeta;

  const isAdmin = (userId: string) =>
    !!selectedGroupDetails?.admins.find((admin) => admin._id === userId);

  const handleChange = (e: CheckboxChangeEvent, participantId: string) => {
    if (e.target.checked) {
      dispatch({ type: "SELECT_PARTICIPANT", payload: { participantId } });
    } else {
      dispatch({ type: "UNSELECT_PARTICIPANT", payload: { participantId } });
    }
  };

  // checkbox-list
  let participantsList;

  if (isSelectedGroupLoading) {
    participantsList = <Skeleton paragraph={{ rows: 4 }} />;
  } else {
    participantsList = (
      <Spin spinning={isSelectedGroupFetching}>
        {totalParticipants.map((participant) => {
          const isSignedInUser = userInfo?.user._id === participant._id;
          const isChecked = selectedParticipantsId.includes(participant._id);

          return (
            <div className={styles.participantCheckbox} key={participant._id}>
              <Checkbox
                checked={isChecked || isSignedInUser}
                disabled={isSignedInUser}
                onChange={(e) => handleChange(e, participant._id)}
              >
                {participant.name} ({participant.email}){"  "}
                {isAdmin(participant._id) ? (
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
        })}
      </Spin>
    );
  }

  return (
    <div className={styles.expenseDetailsContainer}>
      <Typography.Title level={5}>
        Please select the group members involved in this expense:
      </Typography.Title>

      {participantsList}
    </div>
  );
};

export default StepChooseParticipants;
