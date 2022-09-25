import { Alert, Input, Typography } from "antd";
import { ChangeEvent, Dispatch } from "react";
import { actionTypeNewExpenseMeta } from "./state/actions";
import { NewExpenseMeta } from "./state/reducers";
import styles from "./stepAddExpense.module.css";

type PropsStepExpenseDetails = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const StepExpenseDetails = ({
  dispatch,
  newExpenseMeta,
}: PropsStepExpenseDetails) => {
  const { expenseTitle, totalExpenseAmount } = newExpenseMeta;

  const onExpenseTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_EXPENSE_TITLE", payload: target.value });
  };

  const onTotalExpenseAmountChange = ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_TOTAL_EXPENSE_AMOUNT",
      payload: Number(target.value),
    });
  };

  return (
    <div className={styles.expenseDetailsContainer}>
      <div className={styles.expenseDetailsInfo}>
        <Alert
          description="Only the person paying on behalf of other group members is supposed to
          fill this."
          type="info"
          showIcon
          closable
        />
      </div>

      <div>
        <Typography>What did you pay for on others' behalf?</Typography>
        <Input
          placeholder="Expense Title"
          onChange={onExpenseTitleChange}
          value={expenseTitle}
        />
      </div>

      <div>
        <Typography>How much did the entire expense cost?</Typography>
        <Input
          placeholder="Total Expense Amount"
          onChange={onTotalExpenseAmountChange}
          type="number"
          value={totalExpenseAmount}
        />
      </div>
    </div>
  );
};

export default StepExpenseDetails;
