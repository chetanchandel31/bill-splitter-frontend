import { render, screen } from "@testing-library/react";
import BtnAddNewExpense from ".";

test("renders button to add new expense", () => {
  render(<BtnAddNewExpense />);

  const buttonElement = screen.getByRole("button", { name: /add expense/i });

  expect(buttonElement).toBeVisible();
});
