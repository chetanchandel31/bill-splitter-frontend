import { Input, Typography } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { ChangeEvent, Dispatch } from "react";

type PropsStepExpenseDetails = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const StepDistributeExpense = ({
  dispatch,
  newExpenseMeta,
}: PropsStepExpenseDetails) => {
  const onExpenseTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_TOTAL_EXPENSE_AMOUNT",
      payload: Number(e.target.value),
    });
  };

  return (
    <div>
      <Typography.Title level={5}>
        How much did the entire expense cost?
      </Typography.Title>

      <Input
        placeholder="Total Expense Amount"
        type="number"
        onChange={onExpenseTotalChange}
        value={newExpenseMeta.totalExpenseAmount}
      />
    </div>
  );
};

export default StepDistributeExpense;
