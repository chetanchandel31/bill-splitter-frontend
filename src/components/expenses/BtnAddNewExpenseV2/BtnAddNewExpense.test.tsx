import { render, screen, fireEvent } from "testUtils/testUtils";
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
});
