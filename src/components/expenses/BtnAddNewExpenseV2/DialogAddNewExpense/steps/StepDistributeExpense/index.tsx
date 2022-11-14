import { Button, Input, Typography } from "antd";
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
          Divide this expense among participants
        </Typography.Title>

        {/* TODO: maybe center it */}
        <div>
          {isExpenseDistributionInitialised(newExpenseMeta) ? (
            <>
              <div>
                {userInfo?.user.name} ({userInfo?.user.email})
                <Input
                  disabled
                  type="number"
                  onChange={() => {}}
                  value={
                    newExpenseMeta.distributedTotalExpense
                      .amountPaidForOwnExpense
                  }
                />
              </div>
              <div>
                {newExpenseMeta.selectedParticipantsId.map((participantId) => {
                  const participant = getParticipantDetails({
                    participantId,
                    selectedGroupDetails,
                  });

                  return (
                    <div key={participantId}>
                      {participant?.name} ({participant?.email})
                      <Input
                        type="number"
                        onChange={() => {}}
                        value={
                          newExpenseMeta.distributedTotalExpense
                            .borrowerToExpenseMap[participantId]
                        }
                      />
                    </div>
                  );
                })}
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

          <pre>{JSON.stringify(newExpenseMeta, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default StepDistributeExpense;
