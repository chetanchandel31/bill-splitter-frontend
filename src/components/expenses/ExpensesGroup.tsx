import { Collapse, Divider, Empty, Skeleton, Typography } from "antd";
import { useSelectedGroup } from "contexts/group-context";
import moment from "moment";
import { Fragment, useState } from "react";
import styles from "./expensesGroup.module.css";
import AddExpenseBtn from "./StepsAddExpense/AddExpenseBtn";

const { Panel } = Collapse;

const ExpensesGroup = () => {
  const { isSelectedGroupLoading, selectedGroupDetails } = useSelectedGroup();

  const totalParticipants = [
    ...(selectedGroupDetails?.admins || []),
    ...(selectedGroupDetails?.members || []),
  ];

  const [expandedExpenses, setExpandedExpenses] = useState<string[]>([]);

  const onChange = (key: string | string[]) => {
    if (typeof key === "string") {
      setExpandedExpenses((prev) => [...prev, key]);
    } else {
      setExpandedExpenses(key);
    }
  };

  const getParticipantDetails = (participantId: string) =>
    totalParticipants.find((participant) => participant._id === participantId);

  const expenses = selectedGroupDetails?.expenses;
  let expenseList;

  if (isSelectedGroupLoading) {
    expenseList = <Skeleton paragraph={{ rows: 4 }} />;
  } else if (expenses?.length) {
    expenseList = (
      <Collapse
        className={`site-collapse-custom-collapse ${styles.collapse}`}
        onChange={onChange}
      >
        {selectedGroupDetails?.expenses.map((expense) => {
          const totalExpenseAmount = expense.borrowers.reduce(
            (prevVal, currentVal) => prevVal + currentVal.amountBorrowed,
            expense.lender.amountPaidForOwnExpense
          );

          const recordedAt = Number(expense.recordedAt.toString().slice(0, -3));

          return (
            <Panel
              className="site-collapse-custom-panel"
              header={
                <div className={styles.expensePanelHeader}>
                  <div>
                    <strong>{expense.expenseTitle}</strong>
                    <div>
                      <Typography.Text type="secondary">
                        <small>
                          {moment
                            .unix(recordedAt)
                            .format("MMMM Do YYYY, h:mm a")}
                        </small>
                      </Typography.Text>
                    </div>
                  </div>

                  {!expandedExpenses.includes(expense._id) && (
                    <span>₹{totalExpenseAmount}</span>
                  )}
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
                  <span>
                    {getParticipantDetails(expense.lender.user)?.name}
                  </span>
                  <span>₹{expense.lender.amountPaidForOwnExpense}</span>
                </div>
                <Divider style={{ margin: "8px 0" }} />

                {expense.borrowers.map((borrower) => (
                  <Fragment key={borrower._id}>
                    <div className={styles.expensePanelItem}>
                      <span>{getParticipantDetails(borrower.user)?.name}</span>
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
    expenseList = (
      <div className={styles.expensesGroupEmptyState}>
        <Empty />
      </div>
    );
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
