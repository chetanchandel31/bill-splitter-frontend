import { createContext } from "react";
import { GroupWithMemberDetails } from "types";

type GroupContextInterface = {
  doHaveSelectedGroup: boolean;
  isSelectedGroupLoading: boolean;
  selectedGroupDetails: GroupWithMemberDetails | null;
  selectGroup: (groupId: string | null) => void;
};

export const GroupContext = createContext<GroupContextInterface>({
  doHaveSelectedGroup: false,
  isSelectedGroupLoading: false,
  selectedGroupDetails: null,
  selectGroup: () => {},
});
