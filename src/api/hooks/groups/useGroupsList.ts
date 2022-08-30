import { useQuery } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, Group } from "types";

export type SuccessResponseUseGroupsList = AxiosResponse<Group[]>;

type UseGroupsListParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseUseGroupsList) => void;
};

const listGroups = () => {
  return API.get<Group[]>("/groups");
};

const useGroupsList = ({ onError, onSuccess }: UseGroupsListParams) => {
  return useQuery<SuccessResponseUseGroupsList, AxiosErrorBillSplitter>(
    ["groups-list"],
    listGroups,
    {
      // enabled: false, // if uncommented only way to refetch would be via refetch function
      onSuccess,
      onError,
    }
  );
};

export default useGroupsList;
