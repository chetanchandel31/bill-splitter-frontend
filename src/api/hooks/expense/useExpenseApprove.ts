import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosErrorBillSplitter } from "types";

export type SuccessResponseExpenseApprove = { ok: boolean };

type PayloadExpenseApprove = {
  groupId: string;
  expenseId: string;
  borrowerId: string;
};

type UseExpenseApproveParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseExpenseApprove) => void;
};

const expenseApprove: MutationFunction<
  SuccessResponseExpenseApprove,
  PayloadExpenseApprove
> = ({ borrowerId, expenseId, groupId }) => {
  return API.patch(`/expenses/${expenseId}/borrowers/${borrowerId}/approve`, {
    groupId,
  });
};

const useExpenseApprove = ({ onError, onSuccess }: UseExpenseApproveParams) => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseExpenseApprove,
    AxiosErrorBillSplitter,
    PayloadExpenseApprove
  >(expenseApprove, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["group"]);
      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useExpenseApprove;
