import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosErrorBillSplitter } from "types";

export type SuccessResponseExpenseSettle = { ok: boolean };

type PayloadExpenseSettle = {
  groupId: string;
  expenseId: string;
};

type UseExpenseSettleParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseExpenseSettle) => void;
};

const expenseSettle: MutationFunction<
  SuccessResponseExpenseSettle,
  PayloadExpenseSettle
> = ({ expenseId, groupId }) => {
  return API.patch(`/expenses/${expenseId}/settle`, { groupId });
};

const useExpenseSettle = ({ onError, onSuccess }: UseExpenseSettleParams) => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseExpenseSettle,
    AxiosErrorBillSplitter,
    PayloadExpenseSettle
  >(expenseSettle, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["group"]);
      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useExpenseSettle;
