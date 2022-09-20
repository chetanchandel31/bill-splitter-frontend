import styles from "./stepAddExpense.module.css";
import { Alert, Input, Typography } from "antd";
import { ChangeEventHandler } from "react";

type PropsStepExpenseDetails = {
  expenseTitle: string;
  totalExpenseAmount: number;
  onExpenseTitleChange: ChangeEventHandler<HTMLInputElement> | undefined;
  onTotalExpenseAmountChange: ChangeEventHandler<HTMLInputElement> | undefined;
};

const StepExpenseDetails = ({
  totalExpenseAmount,
  expenseTitle,
  onTotalExpenseAmountChange,
  onExpenseTitleChange,
}: PropsStepExpenseDetails) => {
  return (
    <div className={styles.expenseDetailsContainer}>
      <div>
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
        <Typography>How much did the entire expense cost you?</Typography>
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
