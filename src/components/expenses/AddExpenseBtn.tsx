import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, message, Modal, Steps } from "antd";
import useExpenseCreate from "api/hooks/expense/useExpenseCreate";
import { useSelectedGroup } from "contexts/group-context";
import { useState } from "react";
import { showErrorMessage } from "utils";
import styles from "./stepAddExpense.module.css";
import StepChooseParticipants from "./StepsAddExpense/StepChooseParticipants";
import StepExpenseDetails from "./StepsAddExpense/StepExpenseDetails";

const { Step } = Steps;

const steps = ["Enter Expense details", "Choose participants"];

const AddExpenseBtn = () => {
  const { selectedGroupDetails } = useSelectedGroup();

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);

  const { mutate: createExpense } = useExpenseCreate({
    onError: showErrorMessage,
    onSuccess: () => message.success("expense added successfully"),
  });

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setCurrentStep(0);
    setExpenseTitle("");
    setTotalExpenseAmount(0);
  };

  let isOkDisabled = false;
  let errorMessage;

  if (currentStep === 0 && (!expenseTitle || !totalExpenseAmount)) {
    isOkDisabled = true;
    errorMessage = "Please enter both expense title and expense amount";
  }

  return (
    <>
      <div className={styles.alignCenter}>
        <Button icon={<PlusOutlined />} onClick={showModal} type="primary">
          Add expense
        </Button>
      </div>

      <Modal
        title="Add new expense"
        visible={isModalVisible}
        onOk={() => {
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
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
            totalExpenseAmount={totalExpenseAmount}
            expenseTitle={expenseTitle}
            onTotalExpenseAmountChange={({ target }) => {
              if (Number(target.value) >= 0) {
                setTotalExpenseAmount(Number(target.value));
              }
            }}
            onExpenseTitleChange={({ target }) => setExpenseTitle(target.value)}
          />
        )}

        {currentStep === 1 && <StepChooseParticipants />}

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
