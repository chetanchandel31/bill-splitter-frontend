import { Alert, Input, Radio, RadioChangeEvent, Space, Typography } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { ChangeEvent, Dispatch } from "react";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";

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

  const onChange = (e: RadioChangeEvent) => {
    dispatch({
      type: "SET_EXPENSE_DISTRIBUTION_MODE",
      payload: e.target.value,
    });
  };

  return (
    <div>
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

      <div>
        <Typography.Title level={5}>
          How would you like to divide this expense among participants ?
        </Typography.Title>

        <Radio.Group
          onChange={onChange}
          value={newExpenseMeta.modeExpenseDistribution}
        >
          <Space direction="vertical">
            <Radio value={"simple"}>Divide amount equally</Radio>
            <Radio value={"advanced"}>Customize how expense is divided</Radio>
          </Space>
        </Radio.Group>

        {newExpenseMeta.modeExpenseDistribution === "simple" && (
          <Alert
            closable
            description={`Simple mode will divide ${
              newExpenseMeta.totalExpenseAmount
                ? getFormattedCurrencyString({
                    amount: newExpenseMeta.totalExpenseAmount,
                  })
                : "the amount"
            } equally among all participants`}
            data-testId="expense-distribution-simple-mode"
            type="info"
            showIcon
          />
        )}
      </div>
    </div>
  );
};

export default StepDistributeExpense;
