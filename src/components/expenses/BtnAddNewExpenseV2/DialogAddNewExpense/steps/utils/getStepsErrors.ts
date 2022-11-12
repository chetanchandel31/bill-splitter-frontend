import { NewExpenseMeta } from "../../../state/reducers";

export const getFirstStepErrors = (newExpenseMeta: NewExpenseMeta) => {
  let errorMessage = "";

  if (!newExpenseMeta.expenseTitle) {
    errorMessage = "You need to enter expense title before proceeding";
  } else if (newExpenseMeta.selectedParticipantsId.length < 1) {
    errorMessage =
      "You need to select atleast one participant other than yourself";
  }

  return errorMessage;
};

export const getSecondStepErrors = (newExpenseMeta: NewExpenseMeta) => {
  let errorMessage = "";

  if (newExpenseMeta.totalExpenseAmount < 1) {
    errorMessage = "Total expense amount can't be zero";
  }

  return errorMessage;
};
