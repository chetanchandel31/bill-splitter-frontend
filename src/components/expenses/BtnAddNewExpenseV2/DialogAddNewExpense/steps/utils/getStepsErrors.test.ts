import { getFirstStepErrors, getSecondStepErrors } from "./getStepsErrors";

describe("getStepsErrors", () => {
  test("first step errors", () => {
    expect(
      getFirstStepErrors({
        currentStep: 0,
        expenseTitle: "",
        isModalVisible: true,
        selectedParticipantsId: [],
        totalExpenseAmount: 11,
      })
    ).toEqual("You need to enter expense title before proceeding");

    expect(
      getFirstStepErrors({
        currentStep: 0,
        expenseTitle: "my expense",
        isModalVisible: true,
        selectedParticipantsId: [],
        totalExpenseAmount: 11,
      })
    ).toEqual("You need to select atleast one participant other than yourself");

    expect(
      getFirstStepErrors({
        currentStep: 0,
        expenseTitle: "my expense",
        isModalVisible: true,
        selectedParticipantsId: ["mockID"],
        totalExpenseAmount: 11,
      })
    ).toEqual("");
  });

  test("second step errors", () => {
    expect(
      getSecondStepErrors({
        currentStep: 0,
        expenseTitle: "aa",
        isModalVisible: true,
        selectedParticipantsId: [],
        totalExpenseAmount: 0,
      })
    ).toBe("Total expense amount can't be zero");

    expect(
      getSecondStepErrors({
        currentStep: 0,
        expenseTitle: "aa",
        isModalVisible: true,
        selectedParticipantsId: [],
        totalExpenseAmount: 80,
      })
    ).toBe("");
  });
});
