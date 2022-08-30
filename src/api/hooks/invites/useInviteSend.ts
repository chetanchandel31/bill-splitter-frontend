import { MutationFunction, useMutation } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter } from "types";

type InviteSendResponse = {
  ok: boolean;
  message: string;
};

export type SuccessResponseInviteSend = AxiosResponse<InviteSendResponse>;

type PayloadInviteSend = {
  invitedUserName: string;
  groupId: string;
};

type UseInviteSendParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseInviteSend) => void;
};

const sendInvite: MutationFunction<
  SuccessResponseInviteSend,
  PayloadInviteSend
> = ({ groupId, invitedUserName }) => {
  return API.post<InviteSendResponse>("/invite-send", {
    groupId,
    invitedUserName,
  });
};

const useInviteSend = ({ onError, onSuccess }: UseInviteSendParams) => {
  return useMutation<
    SuccessResponseInviteSend,
    AxiosErrorBillSplitter,
    PayloadInviteSend
  >(sendInvite, {
    onSuccess: (data) => {
      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useInviteSend;
