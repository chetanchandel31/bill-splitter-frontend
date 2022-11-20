import { render, screen, fireEvent, within } from "testUtils/testUtils";
import { UserInfo } from "types";
import BtnAddNewExpense from ".";

jest.mock("contexts/auth-context/useAuth", () => ({
  // __esModule: true,
  useAuth: () => {
    const userInfo: UserInfo = {
      token: "abc",
      user: {
        email: "email@mock.com",
        name: "mock name",
        _id: "630b0f14c524fcdbcd0f1c7d",
      },
    };
    return { userInfo };
  },
}));

function setupDialog() {
  const utils = render(<BtnAddNewExpense />);

  const buttonAddExpense = screen.getByRole("button", {
    name: /add expense/i,
  });
  fireEvent.click(buttonAddExpense);

  const goToStepTwo = async () => {
    // enter expense title
    const expenseTitleInput = screen.getByPlaceholderText(/expense title/i);
    fireEvent.change(expenseTitleInput, {
      target: { value: "my new expense" },
    });

    // select participants
    const selectParticipantsContainer = screen.getByTestId(
      "container-select-participants"
    );
    const checkboxes: HTMLInputElement[] = await within(
      selectParticipantsContainer
    ).findAllByRole("checkbox");
    const uncheckedCheckboxes = checkboxes.filter(
      (checkbox) => !checkbox.checked
    );

    uncheckedCheckboxes.forEach((checkbox) => fireEvent.click(checkbox));

    // click next button
    const buttonNext = screen.getByRole("button", { name: /next/i });
    fireEvent.click(buttonNext);
  };

  const enterTotalExpenseAndStartDividing = (totalExpense: number) => {
    const btnStartDividing = screen.getByRole("button", {
      name: /start dividing/i,
    });
    const totalExpenseTextbox: HTMLInputElement =
      screen.getByPlaceholderText(/Total Expense Amount/i);

    fireEvent.change(totalExpenseTextbox, { target: { value: totalExpense } });
    fireEvent.click(btnStartDividing);
  };

  return { ...utils, goToStepTwo, enterTotalExpenseAndStartDividing };
}

describe("Button: add new expense", () => {
  test("renders button w/o error", () => {
    render(<BtnAddNewExpense />);

    const buttonElement = screen.getByRole("button", { name: /add expense/i });

    expect(buttonElement).toBeVisible();
  });

  test("opens the dialog on click", () => {
    setupDialog();

    const dialog = screen.getByRole("dialog", {
      name: /add new expense/i,
    });

    expect(dialog).toBeInTheDocument();
  });

  test("closes the dialog on clicking cancel", () => {
    setupDialog();

    const cancelButtonElement = screen.getByRole("button", { name: /cancel/i });

    expect(cancelButtonElement).toBeInTheDocument();

    const dialog = screen.getByRole("dialog", {
      name: /add new expense/i,
    });

    fireEvent.click(cancelButtonElement);

    expect(dialog).not.toBeVisible();
  });
});

describe("step 1", () => {
  test("next button should be disabled initially", () => {
    setupDialog();

    const buttonNext = screen.getByRole("button", { name: /next/i });
    expect(buttonNext).toBeDisabled();
  });

  test("participants list should have only 1 user with '(you)' tag", async () => {
    setupDialog();

    const youTag = await screen.findByText(/\(you\)/i);

    expect(youTag).toBeInTheDocument();
  });

  test("first step validations", async () => {
    // open dialog
    setupDialog();
    const buttonNext = screen.getByRole("button", { name: /next/i });

    // initial error
    const errorNoTitle = screen.getByText(
      /you need to enter expense title before proceeding/i
    );
    expect(buttonNext).toBeDisabled();
    expect(errorNoTitle).toBeVisible();

    // after entering expense title
    const expenseTitleInput = screen.getByPlaceholderText(/expense title/i);
    fireEvent.change(expenseTitleInput, {
      target: { value: "my new expense" },
    });
    const errorSelectParticipants = screen.getByText(
      /you need to select atleast one participant other than yourself/i
    );
    expect(buttonNext).toBeDisabled();
    expect(errorSelectParticipants).toBeInTheDocument();

    // afetr selecting a participant
    const selectParticipantsContainer = screen.getByTestId(
      "container-select-participants"
    );
    const checkboxes: HTMLInputElement[] = await within(
      selectParticipantsContainer
    ).findAllByRole("checkbox");
    const firstUncheckedCheckbox = checkboxes.find(
      (checkbox) => !checkbox.checked
    );

    if (firstUncheckedCheckbox) fireEvent.click(firstUncheckedCheckbox);
    const errorMessage = screen.queryByTestId("error-message-new-expense");

    expect(firstUncheckedCheckbox).toBeTruthy();
    expect(buttonNext).not.toBeDisabled();
    expect(errorMessage).not.toBeInTheDocument();
  });
});

describe("step 2", () => {
  test("'start dividing' button is disabled until expense amount is entered", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();

    const btnStartDividing = screen.getByRole("button", {
      name: /start dividing/i,
    });
    const totalExpenseTextbox: HTMLInputElement =
      screen.getByPlaceholderText(/Total Expense Amount/i);

    expect(btnStartDividing).toBeDisabled();

    fireEvent.change(totalExpenseTextbox, { target: { value: 12 } });

    expect(btnStartDividing).not.toBeDisabled();
    expect(totalExpenseTextbox.value).toBe("12");
  });

  test("'total expense' doesn't accept text values", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();

    const totalExpenseTextbox: HTMLInputElement =
      screen.getByPlaceholderText(/Total Expense Amount/i);

    fireEvent.change(totalExpenseTextbox, { target: { value: "hello" } });

    expect(totalExpenseTextbox.value).toBe("0");
  });

  test("clicking on 'start dividing' btn shows divide-list and hides that button", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();
    utils.enterTotalExpenseAndStartDividing(12);

    const btnStartDividing = screen.queryByRole("button", {
      name: /start dividing/i,
    });
    const expenseDivideList = screen.queryByTestId("expense-divide-list");

    expect(btnStartDividing).not.toBeInTheDocument();
    expect(expenseDivideList).toBeInTheDocument();
  });

  test("create expense btn should stay disabled until we divide expenses", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();

    const createExpenseBtn = screen.getByRole("button", {
      name: /create new expense/i,
    });

    expect(createExpenseBtn).toBeDisabled();

    utils.enterTotalExpenseAndStartDividing(12);

    expect(createExpenseBtn).not.toBeDisabled();
  });

  test("textboxes in expense-divide list are initiated with correctly divided values", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();
    utils.enterTotalExpenseAndStartDividing(12);

    const expenseDivideList = screen.getByTestId("expense-divide-list");
    const dividedExpenseTextboxes: HTMLInputElement[] = within(
      expenseDivideList
    ).getAllByRole("spinbutton", {
      name: "divided-expense",
    });

    dividedExpenseTextboxes.forEach((textbox) => {
      // mock API response makes us have 3 participants
      expect(textbox.value).toBe("4"); // 12 / 3 = 4
    });
  });

  test("textboxes in expense-divide list least possible value should be 1", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();
    utils.enterTotalExpenseAndStartDividing(12);

    const expenseDivideList = screen.getByTestId("expense-divide-list");
    const dividedExpenseTextboxes: HTMLInputElement[] = within(
      expenseDivideList
    ).getAllByRole("spinbutton", {
      name: "divided-expense",
    });

    fireEvent.change(dividedExpenseTextboxes[0], {
      target: { value: 0 },
    });
    expect(dividedExpenseTextboxes[0].value).toBe("1");
  });

  test("renders total expense & updating textfields updates total", async () => {
    const utils = setupDialog();
    await utils.goToStepTwo();
    utils.enterTotalExpenseAndStartDividing(12);

    const expenseDivideList = screen.getByTestId("expense-divide-list");

    const expenseTotal = within(expenseDivideList).getByTestId("expense-total");

    expect(expenseTotal.textContent).toBe("₹12.00");

    const dividedExpenseTextboxes: HTMLInputElement[] = within(
      expenseDivideList
    ).getAllByRole("spinbutton", {
      name: "divided-expense",
    });

    fireEvent.change(dividedExpenseTextboxes[0], {
      target: { value: Number(dividedExpenseTextboxes[0].value) + 2 },
    });

    expect(expenseTotal.textContent).toBe("₹14.00"); // 12 + 2
  });
});
