import { createContext } from "react";
import { GroupWithMemberDetails } from "types";

type GroupContextInterface = {
  doHaveSelectedGroup: boolean;
  selectedGroupDetails: GroupWithMemberDetails | null;
  selectGroup: (id: string | null) => void;
};

export const GroupContext = createContext<GroupContextInterface>({
  doHaveSelectedGroup: false,
  selectedGroupDetails: null,
  selectGroup: () => {},
});
