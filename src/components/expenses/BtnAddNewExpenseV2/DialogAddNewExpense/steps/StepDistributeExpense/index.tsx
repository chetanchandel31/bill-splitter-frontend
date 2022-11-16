import { Button, Input, Tag, Typography } from "antd";
import { actionTypeNewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/actions";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import { ChangeEvent, Dispatch } from "react";
import { getParticipantDetails } from "utils";
import isExpenseDistributionInitialised from "../utils/isExpenseDistributionInitialised";

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

  const onExpenseTotalChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_TOTAL_EXPENSE_AMOUNT",
      payload: Number(e.target.value),
    });
  };

  const onOwnExpenseShareChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE_OWN_SHARE_IN_EXPENSE_DISTRIBUTION",
      payload: { amount: Number(e.target.value) },
    });
  };

  const onParticipantExpenseChange = (
    e: ChangeEvent<HTMLInputElement>,
    participantId: string
  ) => {
    dispatch({
      type: "UPDATE_PARTICIPANT_EXPENSE_DISTRIBUTION",
      payload: {
        amount: Number(e.target.value),
        participantId,
      },
    });
  };

  return (
    <div>
      {!isExpenseDistributionInitialised(newExpenseMeta) && (
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
      )}

      <div>
        <Typography.Title level={5}>
          Divide this expense among participants
        </Typography.Title>

        {/* TODO: maybe center it */}
        <div>
          {isExpenseDistributionInitialised(newExpenseMeta) ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%" }}>
                  <strong>{userInfo?.user.name}</strong> ({userInfo?.user.email}
                  ){" "}
                  <div>
                    <Tag style={{ userSelect: "none" }}>(You)</Tag>
                    <Tag color="success" style={{ userSelect: "none" }}>
                      Lender
                    </Tag>
                  </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                  <Input
                    onChange={onOwnExpenseShareChange}
                    type="number"
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
                        key={participant?._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ width: "80%" }}>
                          <strong>{participant?.name}</strong> (
                          {participant?.email})
                          <div>
                            <Tag color="warning" style={{ userSelect: "none" }}>
                              Borrower
                            </Tag>
                          </div>
                        </div>

                        <div style={{ flexGrow: 1 }}>
                          <Input
                            type="number"
                            onChange={(e) => {
                              onParticipantExpenseChange(e, participantId);
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "80%", border: "solid 1px red" }}>
                  <strong>Total</strong>
                </div>

                <div style={{ flexGrow: 1, textAlign: "right" }}>xyz</div>
              </div>
            </>
          ) : (
            <Button
              disabled={!newExpenseMeta.totalExpenseAmount}
              onClick={() => {
                dispatch({ type: "INITIALIZE_EXPENSE_DISTRIBUTION" });
              }}
            >
              Start dividing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepDistributeExpense;
