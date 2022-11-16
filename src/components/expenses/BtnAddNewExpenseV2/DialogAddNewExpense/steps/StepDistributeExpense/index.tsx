import { Button, Input, Typography } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { ChangeEvent, Dispatch } from "react";
import isExpenseDistributionInitialised from "../utils/isExpenseDistributionInitialised";
import ExpenseDivideList from "./ExpenseDivideList";
import styles from "./stepDistributeExpense.module.css";

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
    <div className={styles.distributeExpenseContainer}>
      {!isExpenseDistributionInitialised(newExpenseMeta) && (
        <div className={styles.totalExpenseAmountContainer}>
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
      )}

      <div>
        <Typography.Title level={5}>
          Divide this expense among participants
        </Typography.Title>

        <div className={styles.expenseDivideListContainer}>
          {isExpenseDistributionInitialised(newExpenseMeta) ? (
            <ExpenseDivideList
              dispatch={dispatch}
              newExpenseMeta={newExpenseMeta}
            />
          ) : (
            <div className={styles.containerBtnStartDividing}>
              <Button
                disabled={!newExpenseMeta.totalExpenseAmount}
                onClick={() => {
                  dispatch({ type: "INITIALIZE_EXPENSE_DISTRIBUTION" });
                }}
              >
                Start dividing
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepDistributeExpense;
