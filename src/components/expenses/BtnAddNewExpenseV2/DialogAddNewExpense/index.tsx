import { Alert, message, Modal, Steps } from "antd";
import useExpenseCreate from "api/hooks/expense/useExpenseCreate";
import { Dispatch } from "react";
import { showErrorMessage } from "utils";
import { actionTypeNewExpenseMeta } from "../state/actions";
import { NewExpenseMeta } from "../state/reducers";
import StepDistributeExpense from "./steps/StepDistributeExpense";
import StepExpenseDetails from "./steps/StepExpenseDetails";
import styles from "../stepAddExpense.module.css";
import { getFirstStepErrors } from "../utils/getStepsErrors";

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
  } else if (
    currentStep === 1 &&
    newExpenseMeta.selectedParticipantsId.length < 1
  ) {
    errorMessage =
      "You need to have atleast one participant other than yourself";
  }

  const handleOk = () => {
    if (currentStep < steps.length - 1) {
      dispatch({ type: "INCREMENT_STEP" });
    } else {
      // make network call, either basic or advanced

      console.log(createExpense, "create expense network call");

      // const { selectedParticipantsId } = newExpenseMeta;
      // const perParticipantExpenseAmount =
      //   totalExpenseAmount / (selectedParticipantsId.length + 1);
      // createExpense({
      //   expenseTitle,
      //   groupId: selectedGroupDetails?._id ?? "",
      //   amountPaidForOwnExpense: perParticipantExpenseAmount,
      //   borrowers: selectedParticipantsId.map((id) => ({
      //     amountBorrowed: perParticipantExpenseAmount,
      //     user: id,
      //   })),
      // });
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

      {currentStep === 1 && <StepDistributeExpense />}

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
