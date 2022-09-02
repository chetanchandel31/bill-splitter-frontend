import useGroupGetById from "api/hooks/groups/useGroupGetById";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosErrorBillSplitter } from "types";
import { showErrorMessage } from "utils";
import { GroupContext } from "./group-context";

const SELECTED_GROUP = "selected-group";

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const selectedGroupId = localStorage.getItem(SELECTED_GROUP);
  const navigate = useNavigate();

  const onError = (error: AxiosErrorBillSplitter) => {
    showErrorMessage(error);
    localStorage.removeItem(SELECTED_GROUP);
    navigate("/group-selection");
  };

  const { data, isFetching } = useGroupGetById({
    enabled: typeof selectedGroupId === "string",
    groupId: selectedGroupId as string,
    onError,
  });

  const selectGroup = (groupId: string | null) => {
    if (groupId) {
      navigate("/");
      localStorage.setItem("selected-group", groupId);
    } else {
      navigate("/group-selection");
      localStorage.removeItem("selected-group");
    }
  };

  return (
    <GroupContext.Provider
      value={{
        doHaveSelectedGroup: !!selectedGroupId,
        isSelectedGroupLoading: isFetching,
        selectedGroupDetails: data?.data ?? null,
        selectGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
