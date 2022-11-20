import { Divider, InputNumber, Tag } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import React, { Dispatch } from "react";
import { getParticipantDetails } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";
import styles from "./stepDistributeExpense.module.css";

type PropsExpenseDivideList = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const ExpenseDivideList = ({
  dispatch,
  newExpenseMeta,
}: PropsExpenseDivideList) => {
  const { userInfo } = useAuth();
  const { selectedGroupDetails } = useSelectedGroup();

  const borrowerExpenseTotal: number = Object.keys(
    newExpenseMeta.distributedTotalExpense.borrowerToExpenseMap
  ).reduce(
    (prev, current) =>
      prev +
      newExpenseMeta.distributedTotalExpense.borrowerToExpenseMap[current],
    0
  );

  const onOwnExpenseShareChange = (amount: number) => {
    dispatch({
      type: "UPDATE_OWN_SHARE_IN_EXPENSE_DISTRIBUTION",
      payload: { amount },
    });
  };

  const onParticipantExpenseChange = (
    amount: number,
    participantId: string
  ) => {
    dispatch({
      type: "UPDATE_PARTICIPANT_EXPENSE_DISTRIBUTION",
      payload: {
        amount,
        participantId,
      },
    });
  };

  const borrowersList: JSX.Element[] = [];

  newExpenseMeta.arrayOfSelectedParticipantId.forEach((participantId) => {
    const participant = getParticipantDetails({
      participantId,
      selectedGroupDetails,
    });

    borrowersList.push(
      <div className={styles.expenseDivideListItem} key={participant?._id}>
        <div className={styles.expenseDivideListItemLeft}>
          <strong>{participant?.name}</strong> ({participant?.email})
          <div>
            <Tag color="warning" style={{ userSelect: "none" }}>
              Borrower
            </Tag>
          </div>
        </div>

        <div className={styles.expenseDivideListItemRight}>
          <InputNumber
            aria-label="divided-expense"
            name={participant?.name}
            type="number"
            onChange={(value) => {
              onParticipantExpenseChange(value, participantId);
            }}
            value={
              newExpenseMeta.distributedTotalExpense.borrowerToExpenseMap[
                participantId
              ]
            }
          />
        </div>
      </div>
    );
  });

  return (
    <div data-testid="expense-divide-list">
      <div className={styles.expenseDivideListItem}>
        <div className={styles.expenseDivideListItemLeft}>
          <strong>{userInfo?.user.name}</strong> ({userInfo?.user.email}){" "}
          <div>
            <Tag color="success" style={{ userSelect: "none" }}>
              Lender
            </Tag>
            <Tag style={{ userSelect: "none" }}>(You)</Tag>
          </div>
        </div>

        <div className={styles.expenseDivideListItemRight}>
          <InputNumber
            aria-label="divided-expense"
            onChange={onOwnExpenseShareChange}
            value={
              newExpenseMeta.distributedTotalExpense.amountPaidForOwnExpense
            }
          />
        </div>
      </div>

      <div>{borrowersList}</div>

      <Divider />

      <div className={styles.expenseDivideListItem}>
        <div className={styles.expenseDivideListItemLeft}>
          <strong>Total:</strong>
        </div>

        <div className={styles.expenseDivideListItemRight}>
          <strong data-testid="expense-total">
            {getFormattedCurrencyString({
              amount:
                borrowerExpenseTotal +
                newExpenseMeta.distributedTotalExpense.amountPaidForOwnExpense,
            })}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDivideList;
