import { useQuery } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, Invite } from "types";

export type SuccessResponseUseInvitesList = AxiosResponse<Invite[]>;

type UseInvitesListParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseUseInvitesList) => void;
};

const listInvites = () => {
  return API.get<Invite[]>("/invites");
};

const useInvitesList = ({ onError, onSuccess }: UseInvitesListParams) => {
  return useQuery<SuccessResponseUseInvitesList, AxiosErrorBillSplitter>(
    ["invites-list", "groups-list"],
    listInvites,
    {
      // enabled: false, // if uncommented only way to refetch would be via refetch function
      onSuccess,
      onError,
    }
  );
};

export default useInvitesList;
