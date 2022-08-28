import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, Group } from "types";

export type SuccessResponseGroupDelete = AxiosResponse<Group>;

type PayloadGroupDelete = {
  groupId: string;
};

type UseGroupDeleteParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseGroupDelete) => void;
};

const groupDelete: MutationFunction<
  SuccessResponseGroupDelete,
  PayloadGroupDelete
> = ({ groupId }) => {
  return API.delete(`/groups/${groupId}`);
};

const useGroupDelete = ({ onError, onSuccess }: UseGroupDeleteParams) => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseGroupDelete,
    AxiosErrorBillSplitter,
    PayloadGroupDelete
  >(groupDelete, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["groups-list"]);
      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useGroupDelete;
