import {
  QueryFunctionContext,
  QueryKey,
  useQuery,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, GroupWithMemberDetails } from "types";

export type SuccessResponseUseGroupGetById =
  AxiosResponse<GroupWithMemberDetails>;

type UseGroupsGetByIdParams = {
  enabled?: boolean;
  groupId: string;
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseUseGroupGetById) => void;
};

const getGroupById = ({ queryKey }: QueryFunctionContext<QueryKey, any>) => {
  const groupId = queryKey[1];
  return API.get<GroupWithMemberDetails>(`/groups/${groupId}`);
};

const useGroupGetById = ({
  enabled = true,
  groupId,
  onError,
  onSuccess,
}: UseGroupsGetByIdParams) => {
  return useQuery<SuccessResponseUseGroupGetById, AxiosErrorBillSplitter>(
    ["group", groupId],
    getGroupById,
    {
      enabled, // if false, only way to refetch would be via refetch function
      onSuccess,
      onError,
    }
  );
};

export default useGroupGetById;
