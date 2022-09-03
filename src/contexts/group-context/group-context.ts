import { createContext } from "react";
import { GroupWithMemberDetails } from "types";

type GroupContextInterface = {
  doHaveSelectedGroup: boolean;
  isSelectedGroupFetching: boolean;
  isSelectedGroupLoading: boolean;
  selectedGroupDetails: GroupWithMemberDetails | null;
  selectGroup: (groupId: string | null) => void;
};

export const GroupContext = createContext<GroupContextInterface>({
  doHaveSelectedGroup: false,
  isSelectedGroupFetching: false,
  isSelectedGroupLoading: false,
  selectedGroupDetails: null,
  selectGroup: () => {},
});
