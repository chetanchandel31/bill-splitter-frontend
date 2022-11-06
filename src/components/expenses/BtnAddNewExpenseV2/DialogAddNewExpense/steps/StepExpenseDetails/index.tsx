import { Alert, Input, Typography } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import styles from "components/expenses/BtnAddNewExpenseV2/stepAddExpense.module.css";
import { ChangeEvent, Dispatch } from "react";
import GroupMembersList from "./GroupMembersList";

type PropsStepExpenseDetails = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const StepExpenseDetails = ({
  dispatch,
  newExpenseMeta,
}: PropsStepExpenseDetails) => {
  const onExpenseTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_EXPENSE_TITLE", payload: target.value });
  };

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
        <Typography.Title level={5}>
          What did you pay for on others' behalf?
        </Typography.Title>
        <Input
          placeholder="Expense Title"
          onChange={onExpenseTitleChange}
          value={newExpenseMeta.expenseTitle}
        />
      </div>

      <Typography.Title level={5}>
        Please select the group members involved in this expense:
      </Typography.Title>

      <GroupMembersList />
    </div>
  );
};

export default StepExpenseDetails;
