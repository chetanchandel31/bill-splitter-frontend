import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter } from "types";

type InviteSettleResponse = {
  ok: boolean;
  inviteStatus: "accepted" | "rejected";
  message: string;
};

export type SuccessResponseUseInviteSettle =
  AxiosResponse<InviteSettleResponse>;

type PayloadSettleInvite = {
  inviteId: string;
  doReject?: boolean;
};

type UseInviteSettleParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseUseInviteSettle) => void;
};

const settleInvite: MutationFunction<
  SuccessResponseUseInviteSettle,
  PayloadSettleInvite
> = ({ inviteId, doReject }) => {
  return API.post<InviteSettleResponse>("/invite-settle", {
    inviteId,
    doReject,
  });
};

const useInviteSettle = ({ onError, onSuccess }: UseInviteSettleParams) => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseUseInviteSettle,
    AxiosErrorBillSplitter,
    PayloadSettleInvite
  >(settleInvite, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["invites-list"]);
      queryClient.invalidateQueries(["groups-list"]);

      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useInviteSettle;
