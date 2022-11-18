import { fireEvent, render, screen, within } from "@testing-library/react";
import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import StepDistributeExpense from ".";

const mockDispatch = jest.fn();
const mockNewExpenseMeta: NewExpenseMeta = {
  currentStep: 1,
  expenseTitle: "",
  isModalVisible: true,
  arrayOfSelectedParticipantId: [],
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

  test("checkbox-list for dividing expense should initially not be there", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={mockNewExpenseMeta}
      />
    );

    const expenseDivideList = screen.queryByTestId("expense-divide-list");

    expect(expenseDivideList).not.toBeInTheDocument();
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

  test("checkbox-list for dividing expense shows correct number of list items after initialisation", () => {
    // TODO: implementation detail, parent should check if user interaction actually works
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={{
          ...mockNewExpenseMeta,
          arrayOfSelectedParticipantId: ["mockId", "mockId2"],
          distributedTotalExpense: {
            amountPaidForOwnExpense: 1,
            borrowerToExpenseMap: {
              mockId: 12,
              mockId2: 123,
            },
          },
        }}
      />
    );

    const expenseDivideList = screen.getByTestId("expense-divide-list");

    const lenderBadge = within(expenseDivideList).getByText(/lender/i);
    const borrowerBadges = within(expenseDivideList).getAllByText(/borrower/i);

    expect(lenderBadge).toBeInTheDocument();
    expect(borrowerBadges.length).toBe(2);
  });

  test("shows correct total", () => {
    render(
      <StepDistributeExpense
        dispatch={mockDispatch}
        newExpenseMeta={{
          ...mockNewExpenseMeta,
          arrayOfSelectedParticipantId: ["mockId", "mockId2"],
          distributedTotalExpense: {
            amountPaidForOwnExpense: 1,
            borrowerToExpenseMap: {
              mockId: 12,
              mockId2: 123,
            },
          },
        }}
      />
    );

    const expenseTotal = screen.getByTestId("expense-total");

    expect(expenseTotal.textContent).toBe("₹136.00"); // 1 + 12 + 123
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
});
