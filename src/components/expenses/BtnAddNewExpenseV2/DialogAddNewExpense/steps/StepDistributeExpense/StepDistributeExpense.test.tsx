import { fireEvent, render, screen } from "@testing-library/react";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import StepDistributeExpense from ".";

const mockDispatch = jest.fn();
const mockNewExpenseMeta: NewExpenseMeta = {
  currentStep: 1,
  expenseTitle: "",
  isModalVisible: true,
  selectedParticipantsId: [],
  totalExpenseAmount: 100,
};

describe("<StepDistributeExpense />", () => {
  test("renders w/o error", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={mockNewExpenseMeta}
      />
    );
  });

  test("can type in total expense textbox", () => {
    // TODO: it's an implementation detail: to ensure it works for user, parent component will need to have an integration'ish test
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={mockNewExpenseMeta}
      />
    );

    const textboxTotalExpense = screen.getByPlaceholderText(
      "Total Expense Amount"
    );

    fireEvent.change(textboxTotalExpense, { target: { value: 89 } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_TOTAL_EXPENSE_AMOUNT",
      payload: 89,
    });
  });
});
