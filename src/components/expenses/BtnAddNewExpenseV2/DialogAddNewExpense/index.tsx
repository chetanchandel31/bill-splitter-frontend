import { Alert, message, Modal, Steps } from "antd";
import useExpenseCreate from "api/hooks/expense/useExpenseCreate";
import { Dispatch } from "react";
import { showErrorMessage } from "utils";
import { actionTypeNewExpenseMeta } from "../state/actions";
import { NewExpenseMeta } from "../state/reducers";
import StepDistributeExpense from "./steps/StepDistributeExpense";
import StepExpenseDetails from "./steps/StepExpenseDetails";
import styles from "../stepAddExpense.module.css";
import {
  getFirstStepErrors,
  getSecondStepErrors,
} from "./steps/utils/getStepsErrors";
import { useSelectedGroup } from "contexts/group-context";

const { Step } = Steps;

type DialogAddNEwExpenseProps = {
  newExpenseMeta: NewExpenseMeta;
  dispatch: Dispatch<actionTypeNewExpenseMeta>;
};

const steps = ["Enter Expense details", "Distribute expense"];

const DialogAddNewExpense = ({
  dispatch,
  newExpenseMeta,
}: DialogAddNEwExpenseProps) => {
  const { selectedGroupDetails } = useSelectedGroup();

  const { currentStep, isModalVisible } = newExpenseMeta;

  const hideModal = () => dispatch({ type: "DO_SHOW_MODAL", payload: false });

  const { isLoading: isCreateExpenseLoading, mutate: createExpense } =
    useExpenseCreate({
      onError: showErrorMessage,
      onSuccess: () => {
        message.success("expense added successfully");
        hideModal();
      },
    });

  let errorMessage;

  if (currentStep === 0) {
    errorMessage = getFirstStepErrors(newExpenseMeta);
  } else if (currentStep === 1) {
    errorMessage = getSecondStepErrors(newExpenseMeta);
  }

  const handleOk = () => {
    if (currentStep < steps.length - 1) {
      dispatch({ type: "INCREMENT_STEP" });
    } else {
      const borrowerToExpenseMap =
        newExpenseMeta.distributedTotalExpense.borrowerToExpenseMap;

      createExpense({
        expenseTitle: newExpenseMeta.expenseTitle,
        groupId: selectedGroupDetails?._id ?? "",
        amountPaidForOwnExpense:
          newExpenseMeta.distributedTotalExpense.amountPaidForOwnExpense,
        borrowers: newExpenseMeta.arrayOfSelectedParticipantId.map(
          (participantId) => ({
            amountBorrowed: borrowerToExpenseMap[participantId] ?? 1,
            user: participantId,
          })
        ),
      });
    }
  };

  return (
    <Modal
      title="Add new expense"
      visible={isModalVisible}
      onOk={handleOk}
      okButtonProps={{
        disabled: !!errorMessage,
        loading: isCreateExpenseLoading,
      }}
      onCancel={hideModal}
      okText={currentStep < steps.length - 1 ? "Next" : "Create new expense"}
      cancelText="Cancel"
    >
      <Steps current={currentStep} size="small">
        {steps.map((step, i) => (
          <Step title={step} key={i} />
        ))}
      </Steps>

      {currentStep === 0 && (
        <StepExpenseDetails
          dispatch={dispatch}
          newExpenseMeta={newExpenseMeta}
        />
      )}

      {currentStep === 1 && (
        <StepDistributeExpense
          dispatch={dispatch}
          newExpenseMeta={newExpenseMeta}
        />
      )}

      {!!errorMessage && (
        <div
          aria-label="error-message-new-expense"
          className={styles.newExpenseError}
        >
          <Alert message={errorMessage} type="error" />
        </div>
      )}
    </Modal>
  );
};

export default DialogAddNewExpense;
