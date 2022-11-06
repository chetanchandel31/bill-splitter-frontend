// will make network req and render checkboxes with list of participants
// consumer needs to tell
// 1. what happens when checkbox is clicked
// 2. which participants are checked

import { Skeleton } from "antd";
import { useSelectedGroup } from "contexts/group-context";
import { ReactNode } from "react";

const GroupMembersList = () => {
  const {
    selectedGroupDetails,
    isSelectedGroupLoading,
    // isSelectedGroupFetching,
  } = useSelectedGroup();

  let participantsList: ReactNode = null;

  if (isSelectedGroupLoading) {
    participantsList = (
      <div aria-label="skeletonParticipantsList" role={"progressbar"}>
        <Skeleton paragraph={{ rows: 4 }} />
      </div>
    );
  } else {
    participantsList = selectedGroupDetails?.members.map((member) => (
      <div aria-label="participant" key={member.name}>
        {member.name}
      </div>
    ));
  }

  return (
    <div>
      <div>{participantsList}</div>
    </div>
  );
};

export default GroupMembersList;
