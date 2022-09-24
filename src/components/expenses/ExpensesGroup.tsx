import { Collapse, Divider, Empty, Skeleton } from "antd";
import { useSelectedGroup } from "contexts/group-context";
import { Fragment } from "react";
import styles from "./expensesGroup.module.css";
import AddExpenseBtn from "./StepsAddExpense/AddExpenseBtn";

const { Panel } = Collapse;

const ExpensesGroup = () => {
  const { isSelectedGroupLoading, selectedGroupDetails } = useSelectedGroup();

  const expenses = selectedGroupDetails?.expenses;
  let expenseList;

  const getParticipantDetails = (participantId: string) =>
    [
      ...(selectedGroupDetails?.admins || []),
      ...(selectedGroupDetails?.members || []),
    ].find((participant) => participant._id === participantId);

  if (isSelectedGroupLoading) {
    expenseList = <Skeleton paragraph={{ rows: 4 }} />;
  } else if (expenses?.length) {
    expenseList = (
      <Collapse className={styles.collapse}>
        {selectedGroupDetails?.expenses.map((expense) => {
          const totalExpenseAmount = expense.borrowers.reduce(
            (prevVal, currentVal) => prevVal + currentVal.amountBorrowed,
            expense.lender.amountPaidForOwnExpense
          );

          return (
            <Panel
              className="site-collapse-custom-panel"
              header={
                <div className={styles.expensePanelHeader}>
                  <div>
                    <strong>{expense.expenseTitle}</strong>
                    <small>
                      {/* TODO: better formatting and tooltip */}
                      <div>{new Date(expense.recordedAt).toLocaleString()}</div>
                    </small>
                  </div>
                  <span>₹{totalExpenseAmount}</span>
                </div>
              }
              key={expense._id}
            >
              <p>
                <div className={styles.expensePanelItem}>
                  <strong>Username</strong>
                  <strong>Amount</strong>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div className={styles.expensePanelItem}>
                  {getParticipantDetails(expense.lender.user)?.name}:{" "}
                  <span>₹{expense.lender.amountPaidForOwnExpense}</span>
                </div>
                <Divider style={{ margin: "8px 0" }} />

                {expense.borrowers.map((borrower) => (
                  <Fragment key={borrower._id}>
                    <div className={styles.expensePanelItem}>
                      {getParticipantDetails(borrower.user)?.name}:{" "}
                      <span>₹{borrower.amountBorrowed}</span>
                    </div>
                    <Divider style={{ margin: "8px 0" }} />
                  </Fragment>
                ))}

                <div className={styles.expensePanelItem}>
                  <strong>Total</strong>
                  <strong>₹{totalExpenseAmount}</strong>
                </div>
              </p>
            </Panel>
          );
        })}
      </Collapse>
    );
  } else {
    expenseList = <Empty />;
  }

  return (
    <>
      <AddExpenseBtn />

      {expenseList}

      <pre>{JSON.stringify(selectedGroupDetails?.expenses, null, 2)}</pre>
    </>
  );
};

export default ExpensesGroup;
