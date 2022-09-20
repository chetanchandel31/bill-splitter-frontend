import { useSelectedGroup } from "contexts/group-context";
import AddExpenseBtn from "./StepsAddExpense/AddExpenseBtn";

const ExpensesGroup = () => {
  const { selectedGroupDetails } = useSelectedGroup();

  return (
    <>
      <AddExpenseBtn />
      <pre>{JSON.stringify(selectedGroupDetails?.expenses, null, 2)}</pre>
    </>
  );
};

export default ExpensesGroup;
