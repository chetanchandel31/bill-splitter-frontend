import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter } from "types";

type ExpenseCreateResponse = { ok: boolean };

export type SuccessResponseExpenseCreate = AxiosResponse<ExpenseCreateResponse>;

type PayloadExpenseCreate = {
  groupId: string;
  expenseTitle: string;
  amountPaidForOwnExpense: number;
  borrowers: { user: string; amountBorrowed: number }[];
};

type UseExpenseCreateParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseExpenseCreate) => void;
};

const expenseCreate: MutationFunction<
  SuccessResponseExpenseCreate,
  PayloadExpenseCreate
> = ({ amountPaidForOwnExpense, borrowers, expenseTitle, groupId }) => {
  return API.post<ExpenseCreateResponse>("/expenses", {
    amountPaidForOwnExpense,
    borrowers,
    expenseTitle,
    groupId,
  });
};

const useExpenseCreate = ({ onError, onSuccess }: UseExpenseCreateParams) => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseExpenseCreate,
    AxiosErrorBillSplitter,
    PayloadExpenseCreate
  >(expenseCreate, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["group"]);
      if (typeof onSuccess === "function") onSuccess(data);
    },
    onError,
  });
};

export default useExpenseCreate;
