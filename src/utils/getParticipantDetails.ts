import { GroupWithMemberDetails } from "types";

type Args = {
  participantId: string;
  selectedGroupDetails: GroupWithMemberDetails | null;
};

export const getParticipantDetails = ({
  participantId,
  selectedGroupDetails,
}: Args) => {
  const totalParticipants = [
    ...(selectedGroupDetails?.admins || []),
    ...(selectedGroupDetails?.members || []),
  ];

  return totalParticipants.find(
    (participant) => participant._id === participantId
  );
};
