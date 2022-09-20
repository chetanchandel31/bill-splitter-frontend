import styles from "../stepAddExpense.module.css";
import { CrownOutlined } from "@ant-design/icons";
import { Checkbox, Skeleton, Spin, Tag, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { useState } from "react";

const StepChooseParticipants = () => {
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

  const isAdmin = (userId: string) =>
    !!selectedGroupDetails?.admins.find((admin) => admin._id === userId);

  const [selectedParticipantsId, setSelectedParticipantsId] = useState<
    string[]
  >([]);

  const handleChange = (e: CheckboxChangeEvent, participantId: string) => {
    if (e.target.checked) {
      setSelectedParticipantsId((prev) => [...prev, participantId]);
    } else {
      setSelectedParticipantsId((prev) =>
        prev.filter((_participantId) => _participantId !== participantId)
      );
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
            <div key={participant._id}>
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
      <Typography>
        Please select the group members involved in this expense:
      </Typography>

      {participantsList}
      <pre>{JSON.stringify(selectedGroupDetails, null, 2)}</pre>
    </div>
  );
};

export default StepChooseParticipants;
