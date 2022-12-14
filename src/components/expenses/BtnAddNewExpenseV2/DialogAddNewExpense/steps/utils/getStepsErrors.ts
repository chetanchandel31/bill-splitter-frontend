import { NewExpenseMeta } from "../../../state/reducers";
import isExpenseDistributionInitialised from "./isExpenseDistributionInitialised";

export const getFirstStepErrors = (newExpenseMeta: NewExpenseMeta) => {
  let errorMessage = "";

  if (!newExpenseMeta.expenseTitle) {
    errorMessage = "You need to enter expense title before proceeding";
  } else if (newExpenseMeta.arrayOfSelectedParticipantId.length < 1) {
    errorMessage =
      "You need to select atleast one participant other than yourself";
  }

  return errorMessage;
};

export const getSecondStepErrors = (newExpenseMeta: NewExpenseMeta) => {
  let errorMessage = "";

  if (newExpenseMeta.totalExpenseAmount < 1) {
    errorMessage = "Total expense amount can't be zero";
  } else if (!isExpenseDistributionInitialised(newExpenseMeta)) {
    errorMessage =
      "Please divide the expense among participants before proceeding";
  }

  return errorMessage;
};
