import { Button, Divider, Input, InputNumber, Tag, Typography } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { ChangeEvent, Dispatch } from "react";
import { getParticipantDetails } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";
import isExpenseDistributionInitialised from "../utils/isExpenseDistributionInitialised";
import styles from "./stepDistributeExpense.module.css";

type PropsStepExpenseDetails = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const StepDistributeExpense = ({
  dispatch,
  newExpenseMeta,
}: PropsStepExpenseDetails) => {
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

  const onExpenseTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_TOTAL_EXPENSE_AMOUNT",
      payload: Number(e.target.value),
    });
  };

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
            <>
              <div className={styles.expenseDivideListItem}>
                <div className={styles.expenseDivideListItemLeft}>
                  <strong>{userInfo?.user.name}</strong> ({userInfo?.user.email}
                  ){" "}
                  <div>
                    <Tag color="success" style={{ userSelect: "none" }}>
                      Lender
                    </Tag>
                    <Tag style={{ userSelect: "none" }}>(You)</Tag>
                  </div>
                </div>

                <div className={styles.expenseDivideListItemRight}>
                  <InputNumber
                    onChange={onOwnExpenseShareChange}
                    value={
                      newExpenseMeta.distributedTotalExpense
                        .amountPaidForOwnExpense
                    }
                  />
                </div>
              </div>

              <div>
                {newExpenseMeta.arrayOfSelectedParticipantId.map(
                  (participantId) => {
                    const participant = getParticipantDetails({
                      participantId,
                      selectedGroupDetails,
                    });

                    return (
                      <div
                        className={styles.expenseDivideListItem}
                        key={participant?._id}
                      >
                        <div className={styles.expenseDivideListItemLeft}>
                          <strong>{participant?.name}</strong> (
                          {participant?.email})
                          <div>
                            <Tag color="warning" style={{ userSelect: "none" }}>
                              Borrower
                            </Tag>
                          </div>
                        </div>

                        <div className={styles.expenseDivideListItemRight}>
                          <InputNumber
                            type="number"
                            onChange={(value) => {
                              onParticipantExpenseChange(value, participantId);
                            }}
                            value={
                              newExpenseMeta.distributedTotalExpense
                                .borrowerToExpenseMap[participantId]
                            }
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <Divider />

              <div className={styles.expenseDivideListItem}>
                <div className={styles.expenseDivideListItemLeft}>
                  <strong>Total:</strong>
                </div>

                <div className={styles.expenseDivideListItemRight}>
                  <strong>
                    {getFormattedCurrencyString({
                      amount:
                        borrowerExpenseTotal +
                        newExpenseMeta.distributedTotalExpense
                          .amountPaidForOwnExpense,
                    })}
                  </strong>
                </div>
              </div>
            </>
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
