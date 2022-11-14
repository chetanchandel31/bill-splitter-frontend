import { NewExpenseMeta } from "components/expenses/BtnAddNewExpenseV2/state/reducers";
import { getFirstStepErrors, getSecondStepErrors } from "./getStepsErrors";

const mockExpenseMeta: NewExpenseMeta = {
  currentStep: 0,
  expenseTitle: "",
  isModalVisible: true,
  selectedParticipantsId: [],
  totalExpenseAmount: 0,
  distributedTotalExpense: {
    amountPaidForOwnExpense: 0,
    borrowerToExpenseMap: {},
  },
};

describe("getStepsErrors", () => {
  test("first step errors", () => {
    expect(
      getFirstStepErrors({
        ...mockExpenseMeta,
        expenseTitle: "",
      })
    ).toEqual("You need to enter expense title before proceeding");

    expect(
      getFirstStepErrors({
        ...mockExpenseMeta,
        expenseTitle: "my expense",
        selectedParticipantsId: [],
      })
    ).toEqual("You need to select atleast one participant other than yourself");

    expect(
      getFirstStepErrors({
        ...mockExpenseMeta,
        expenseTitle: "my expense",
        selectedParticipantsId: ["mockID"],
      })
    ).toEqual("");
  });

  test("second step errors", () => {
    expect(
      getSecondStepErrors({
        ...mockExpenseMeta,
        totalExpenseAmount: 0,
      })
    ).toBe("Total expense amount can't be zero");

    expect(
      getSecondStepErrors({
        ...mockExpenseMeta,
        totalExpenseAmount: 10,
      })
    ).toBe("Please divide the expense among participants before proceeding");

    expect(
      getSecondStepErrors({
        ...mockExpenseMeta,
        totalExpenseAmount: 80,
        distributedTotalExpense: {
          amountPaidForOwnExpense: 1,
          borrowerToExpenseMap: { mockId: 1 },
        },
      })
    ).toBe("");
  });
});
