import {
  Collapse,
  Divider,
  Empty,
  Skeleton,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import moment from "moment";
import { Fragment, useState } from "react";
import { getParticipantDetails } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";
import BtnAddNewExpense from "./BtnAddNewExpenseV2";
import styles from "./expensesGroup.module.css";

const { Panel } = Collapse;

const ExpensesGroup = () => {
  const { userInfo } = useAuth();
  const {
    isSelectedGroupFetching,
    isSelectedGroupLoading,
    selectedGroupDetails,
  } = useSelectedGroup();

  const [expandedExpenses, setExpandedExpenses] = useState<string[]>([]);

  const onChange = (key: string | string[]) => {
    if (typeof key === "string") {
      setExpandedExpenses((prev) => [...prev, key]);
    } else {
      setExpandedExpenses(key);
    }
  };

  const expenses = selectedGroupDetails?.expenses;
  let expenseList;

  if (isSelectedGroupLoading) {
    expenseList = <Skeleton paragraph={{ rows: 4 }} />;
  } else if (expenses?.length) {
    expenseList = (
      <Spin spinning={isSelectedGroupFetching}>
        <Collapse
          className={`site-collapse-custom-collapse ${styles.collapse}`}
          onChange={onChange}
        >
          {selectedGroupDetails?.expenses.map((expense) => {
            const totalExpenseAmount = expense.borrowers.reduce(
              (prevVal, currentVal) => prevVal + currentVal.amountBorrowed,
              expense.lender.amountPaidForOwnExpense
            );

            const recordedAt = Number(
              expense.recordedAt.toString().slice(0, -3)
            );

            const lenderName = getParticipantDetails({
              participantId: expense.lender.user,
              selectedGroupDetails,
            })?.name;

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
                      <span>
                        {getFormattedCurrencyString({
                          amount: totalExpenseAmount,
                        })}
                      </span>
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
                    <Typography.Text type="success">
                      {lenderName}{" "}
                      <Tag color="success" style={{ userSelect: "none" }}>
                        Lender
                      </Tag>
                      {expense.lender.user === userInfo?.user._id && (
                        <Tag style={{ userSelect: "none" }}>(You)</Tag>
                      )}
                    </Typography.Text>
                    <Typography.Text type="success">
                      {getFormattedCurrencyString({
                        amount: expense.lender.amountPaidForOwnExpense,
                      })}
                    </Typography.Text>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />

                  {expense.borrowers.map((borrower) => {
                    let textColor: "danger" | "success" | "warning" = "danger";
                    let expenseStatus = "Unsettled";
                    let tagColor: "error" | "success" | "warning" = "error";
                    let tooltipContent =
                      "The borrowed amount hasn't been paid back yet";

                    if (borrower.isApprovedByLender) {
                      textColor = "success";
                      expenseStatus = "Settled";
                      tagColor = "success";
                      tooltipContent = "The borrowed amount has been paid back";
                    } else if (borrower.isSettled) {
                      textColor = "warning";
                      expenseStatus = "Settlement pending";
                      tagColor = "warning";
                      tooltipContent =
                        "Lender hasn't approved the settlement of this expense yet";
                    }

                    const borrowerName = getParticipantDetails({
                      participantId: borrower.user,
                      selectedGroupDetails,
                    })?.name;

                    return (
                      <Fragment key={borrower._id}>
                        <div className={styles.expensePanelItem}>
                          <Typography.Text type={textColor}>
                            {borrowerName}{" "}
                            {borrower.user === userInfo?.user._id && (
                              <Tag style={{ userSelect: "none" }}>(You)</Tag>
                            )}
                          </Typography.Text>
                          <Typography.Text type={textColor}>
                            <Tooltip title={tooltipContent} placement="left">
                              <Tag
                                color={tagColor}
                                style={{ userSelect: "none" }}
                              >
                                {expenseStatus}
                              </Tag>
                            </Tooltip>{" "}
                            +
                            {getFormattedCurrencyString({
                              amount: borrower.amountBorrowed,
                            })}
                          </Typography.Text>
                        </div>
                        <Divider style={{ margin: "8px 0" }} />
                      </Fragment>
                    );
                  })}

                  <div className={styles.expensePanelItem}>
                    <strong>Total</strong>
                    <strong>
                      =
                      {getFormattedCurrencyString({
                        amount: totalExpenseAmount,
                      })}
                    </strong>
                  </div>
                </p>
              </Panel>
            );
          })}
        </Collapse>
      </Spin>
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
      <BtnAddNewExpense />

      {expenseList}
    </>
  );
};

export default ExpensesGroup;
