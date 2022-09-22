import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, message, Modal, Steps } from "antd";
import useExpenseCreate from "api/hooks/expense/useExpenseCreate";
import { useSelectedGroup } from "contexts/group-context";
import { useReducer } from "react";
import { showErrorMessage } from "utils";
import {
  initialStateNewExpenseMeta,
  reducerNewExpenseMeta,
} from "./state/reducers";
import styles from "./stepAddExpense.module.css";
import StepChooseParticipants from "./StepChooseParticipants";
import StepExpenseDetails from "./StepExpenseDetails";

const { Step } = Steps;

const steps = ["Enter Expense details", "Choose participants"];

const AddExpenseBtn = () => {
  const { selectedGroupDetails } = useSelectedGroup();

  const [newExpenseMeta, dispatch] = useReducer(
    reducerNewExpenseMeta,
    initialStateNewExpenseMeta
  );

  const { currentStep, expenseTitle, isModalVisible, totalExpenseAmount } =
    newExpenseMeta;

  const { mutate: createExpense } = useExpenseCreate({
    onError: showErrorMessage,
    onSuccess: () => message.success("expense added successfully"),
  });

  const showModal = () => dispatch({ type: "DO_SHOW_MODAL", payload: true });
  const hideModal = () => dispatch({ type: "DO_SHOW_MODAL", payload: false });

  let isOkDisabled = false;
  let errorMessage;

  if (currentStep === 0 && (!expenseTitle || !totalExpenseAmount)) {
    isOkDisabled = true;
    errorMessage = "Please enter both expense title and expense amount";
  }

  return (
    <>
      <div className={styles.addExpenseBtnContainer}>
        <Button icon={<PlusOutlined />} onClick={showModal} type="primary">
          Add expense
        </Button>
      </div>

      <Modal
        title="Add new expense"
        visible={isModalVisible}
        onOk={() => {
          if (currentStep < steps.length - 1) {
            dispatch({ type: "INCREMENT_STEP" });
          } else {
            createExpense({
              expenseTitle,
              groupId: selectedGroupDetails?._id ?? "",
              amountPaidForOwnExpense: 11,
              borrowers: [],
            });
            hideModal();
          }
        }}
        okButtonProps={{ disabled: isOkDisabled }}
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
          <StepChooseParticipants
            dispatch={dispatch}
            newExpenseMeta={newExpenseMeta}
          />
        )}

        {isOkDisabled && (
          <div className={styles.alignCenter}>
            <Alert message={errorMessage} type="error" />
          </div>
        )}
      </Modal>
    </>
  );
};

export default AddExpenseBtn;
