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
  modeExpenseDistribution: "simple",
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

  test("fires correct functions upon switching 'expense distribution modes'", () => {
    // TODO: again an implementation detail: parent component should test if it actually switches different modes for users
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={mockNewExpenseMeta}
      />
    );

    const radioAdvanceedMode = screen.getByRole("radio", {
      name: /Customize how expense is divided/i,
    });

    fireEvent.click(radioAdvanceedMode);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_EXPENSE_DISTRIBUTION_MODE",
      payload: "advanced",
    });
  });

  test("expense-distribution-simple-mode should be open by default", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={mockNewExpenseMeta}
      />
    );

    const simpleExpenseDistributionInfoBox = screen.getByTestId(
      "expense-distribution-simple-mode"
    );

    expect(simpleExpenseDistributionInfoBox).toBeInTheDocument();
  });

  test("expense-distribution-advanced-mode should be opened when props specify", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={{
          ...mockNewExpenseMeta,
          modeExpenseDistribution: "advanced",
        }}
      />
    );

    const simpleExpenseDistributionInfoBox = screen.queryByTestId(
      "expense-distribution-simple-mode"
    );

    expect(simpleExpenseDistributionInfoBox).not.toBeInTheDocument();
  });
});
