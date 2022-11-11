import { render, screen, fireEvent, within } from "testUtils/testUtils";
import BtnAddNewExpense from ".";

describe("Button: add new expense", () => {
  test("renders button w/o error", () => {
    render(<BtnAddNewExpense />);

    const buttonElement = screen.getByRole("button", { name: /add expense/i });

    expect(buttonElement).toBeVisible();
  });

  test("opens the dialog on click", () => {
    render(<BtnAddNewExpense />);

    const buttonElement = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(buttonElement);

    const dialog = screen.getByRole("dialog", {
      name: /add new expense/i,
    });

    expect(dialog).toBeInTheDocument();
  });

  test("closes the dialog on clicking cancel", () => {
    render(<BtnAddNewExpense />);

    const buttonElement = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(buttonElement);

    const cancelButtonElement = screen.getByRole("button", { name: /cancel/i });

    expect(cancelButtonElement).toBeInTheDocument();

    const dialog = screen.getByRole("dialog", {
      name: /add new expense/i,
    });

    fireEvent.click(cancelButtonElement);

    expect(dialog).not.toBeVisible();
  });

  test("next button should be disabled initially", () => {
    render(<BtnAddNewExpense />);

    const buttonAddExpense = screen.getByRole("button", {
      name: /add expense/i,
    });
    fireEvent.click(buttonAddExpense);

    const buttonNext = screen.getByRole("button", { name: /next/i });
    expect(buttonNext).toBeDisabled();
  });

  test("first step validations", async () => {
    // open dialog
    render(<BtnAddNewExpense />);

    const buttonAddExpense = screen.getByRole("button", {
      name: /add expense/i,
    });
    fireEvent.click(buttonAddExpense);
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
