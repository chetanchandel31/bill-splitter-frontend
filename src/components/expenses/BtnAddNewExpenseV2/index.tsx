import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import useExpenseCreate from "api/hooks/expense/useExpenseCreate";
import { useSelectedGroup } from "contexts/group-context";
import { useReducer } from "react";
import { showErrorMessage } from "utils";
import ExpensesGroupTotal from "../ExpensesGroupTotal";
import {
  initialStateNewExpenseMeta,
  reducerNewExpenseMeta,
} from "./state/reducers";
import styles from "./stepAddExpense.module.css";

const steps = ["Enter Expense details", "Distribute expense"];

const BtnAddNewExpense = () => {
  const { selectedGroupDetails } = useSelectedGroup();

  const [newExpenseMeta, dispatch] = useReducer(
    reducerNewExpenseMeta,
    initialStateNewExpenseMeta
  );

  const { currentStep, expenseTitle, isModalVisible, totalExpenseAmount } =
    newExpenseMeta;

  const showModal = () => dispatch({ type: "DO_SHOW_MODAL", payload: true });
  const hideModal = () => dispatch({ type: "DO_SHOW_MODAL", payload: false });

  const { isLoading: isCreateExpenseLoading, mutate: createExpense } =
    useExpenseCreate({
      onError: showErrorMessage,
      onSuccess: () => {
        message.success("expense added successfully");
        hideModal();
      },
    });

  let isOkDisabled = false;
  let errorMessage;

  if (currentStep === 0 && (!expenseTitle || !totalExpenseAmount)) {
    isOkDisabled = true;
    errorMessage = "Please enter both expense title and expense amount";
  } else if (
    currentStep === 1 &&
    newExpenseMeta.selectedParticipantsId.length < 1
  ) {
    isOkDisabled = true;
    errorMessage =
      "You need to have atleast one participant other than yourself";
  }

  const handleOk = () => {
    if (currentStep < steps.length - 1) {
      dispatch({ type: "INCREMENT_STEP" });
    } else {
      const { selectedParticipantsId } = newExpenseMeta;
      const perParticipantExpenseAmount =
        totalExpenseAmount / (selectedParticipantsId.length + 1);

      createExpense({
        expenseTitle,
        groupId: selectedGroupDetails?._id ?? "",
        amountPaidForOwnExpense: perParticipantExpenseAmount,
        borrowers: selectedParticipantsId.map((id) => ({
          amountBorrowed: perParticipantExpenseAmount,
          user: id,
        })),
      });
    }
  };

  return (
    <div
      className={styles.addExpenseBtnContainer}
      style={{ border: "solid 1px red" }} // TODO: remove
    >
      <Button icon={<PlusOutlined />} onClick={showModal} type="primary">
        Add expense
      </Button>

      <ExpensesGroupTotal />

      <Modal
        title="Add new expense"
        visible={isModalVisible}
        onOk={handleOk}
        okButtonProps={{
          disabled: isOkDisabled,
          loading: isCreateExpenseLoading,
        }}
        onCancel={hideModal}
        okText={currentStep < steps.length - 1 ? "Next" : "Create new expense"}
        cancelText="Cancel"
      ></Modal>
    </div>
  );
};

export default BtnAddNewExpense;
