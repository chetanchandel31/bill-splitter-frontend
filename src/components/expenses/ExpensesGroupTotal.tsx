import { Statistic } from "antd";
import { useSelectedGroup } from "contexts/group-context";
import { Expense } from "types";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";

const ExpensesGroupTotal = () => {
  const { selectedGroupDetails } = useSelectedGroup();

  const getGroupExpenseTotal = (expenses: Expense[]): number => {
    let totalExpense = 0;

    expenses.forEach((expense) => {
      const expenseAmountByLender = expense.lender.amountPaidForOwnExpense;

      const expenseAmountByBorrowers = expense.borrowers.reduce(
        (prevVal, currentVal) => prevVal + currentVal.amountBorrowed,
        0
      );

      totalExpense += expenseAmountByLender + expenseAmountByBorrowers;
    });

    return totalExpense;
  };

  const groupExpenseTotal = getGroupExpenseTotal(
    selectedGroupDetails?.expenses ?? []
  );

  return selectedGroupDetails?.expenses ? (
    <Statistic
      style={{ textAlign: "right" }}
      title="Group's total expense"
      value={getFormattedCurrencyString({ amount: groupExpenseTotal })}
    />
  ) : null;
};

export default ExpensesGroupTotal;
