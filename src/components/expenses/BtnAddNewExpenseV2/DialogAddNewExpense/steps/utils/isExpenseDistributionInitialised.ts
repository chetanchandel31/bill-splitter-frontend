import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";

const isExpenseDistributionInitialised = (newExpenseMeta: NewExpenseMeta) => {
  return (
    Object.keys(newExpenseMeta.distributedTotalExpense.borrowerToExpenseMap)
      .length > 0
  );
};

export default isExpenseDistributionInitialised;
