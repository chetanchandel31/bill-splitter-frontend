import { fireEvent, render, screen } from "@testing-library/react";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import StepDistributeExpense from ".";

const mockDispatch = jest.fn();
const mockNewExpenseMeta: NewExpenseMeta = {
  currentStep: 1,
  expenseTitle: "",
  isModalVisible: true,
  selectedParticipantsId: [],
  totalExpenseAmount: 0,
  distributedTotalExpense: {
    amountPaidForOwnExpense: 0,
    borrowerToExpenseMap: {},
  },
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

  test("button to start dividing expense should be existing and initially disabled(disabled because no total expense amount exists)", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={mockNewExpenseMeta}
      />
    );

    const btnStartDividingExpense = screen.getByRole("button", {
      name: /start dividing/i,
    });

    expect(btnStartDividingExpense).toBeDisabled();
  });

  test("button to start dividing expense should not be disabled when total expense amount exists", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={{ ...mockNewExpenseMeta, totalExpenseAmount: 2 }}
      />
    );

    const btnStartDividingExpense = screen.getByRole("button", {
      name: /start dividing/i,
    });

    expect(btnStartDividingExpense).not.toBeDisabled();
  });

  test("clicking on 'start dividing' button fires correct function", () => {
    // TODO: implementation detail, parent should check if user interaction actually works
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={{ ...mockNewExpenseMeta, totalExpenseAmount: 2 }}
      />
    );

    const btnStartDividingExpense = screen.getByRole("button", {
      name: /start dividing/i,
    });

    fireEvent.click(btnStartDividingExpense);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "INITIALIZE_EXPENSE_DISTRIBUTION",
    });
  });

  // TODO: when map exists btn shouldn't exist but textfields should
});
