import { MutationFunction, useMutation } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, Group } from "types";

export type SuccessResponseGroupCreate = AxiosResponse<Group>;

type PayloadGroupCreate = {
  groupName: string;
};

type UseCreateGroupParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseGroupCreate) => void;
};

const groupCreate: MutationFunction<
  SuccessResponseGroupCreate,
  PayloadGroupCreate
> = ({ groupName }) => {
  return API.post("/groups", { groupName });
};

const useGroupCreate = ({ onError, onSuccess }: UseCreateGroupParams) => {
  return useMutation<
    SuccessResponseGroupCreate,
    AxiosErrorBillSplitter,
    PayloadGroupCreate
  >(groupCreate, {
    onSuccess,
    onError,
  });
};

export default useGroupCreate;
