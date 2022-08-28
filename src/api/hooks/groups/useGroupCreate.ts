import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, Group } from "types";

export type SuccessResponseGroupCreate = AxiosResponse<Group>;

type PayloadGroupCreate = {
  groupName: string;
};

type UseGroupCreateParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseGroupCreate) => void;
};

const groupCreate: MutationFunction<
  SuccessResponseGroupCreate,
  PayloadGroupCreate
> = ({ groupName }) => {
  return API.post<Group>("/groups", { groupName });
};

const useGroupCreate = ({ onError, onSuccess }: UseGroupCreateParams) => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseGroupCreate,
    AxiosErrorBillSplitter,
    PayloadGroupCreate
  >(groupCreate, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["groups-list"]);
      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useGroupCreate;
