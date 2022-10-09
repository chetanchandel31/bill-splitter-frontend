import { Card, Col, Row, Spin, Statistic, Tabs, Typography } from "antd";
import TabAmountToReceive from "components/expenses-personal/TabAmountToReceive";
import TabAmountToReturn from "components/expenses-personal/TabAmountToReturn";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import Layout from "helpers/Layout";
import { Expense } from "types";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";
import styles from "./personalExpenses.module.css";

const PersonalExpenses = () => {
  const { userInfo } = useAuth();
  const { selectedGroupDetails, isSelectedGroupFetching } = useSelectedGroup();

  // total amount to receive
  const getTotalAmountToBeReceived = (expenses: Expense[]): number => {
    let amountToBeReceived = 0;

    expenses.forEach((expense) => {
      if (expense.lender.user === userInfo?.user._id) {
        expense.borrowers.forEach((borrower) => {
          if (!borrower.isApprovedByLender) {
            amountToBeReceived += borrower.amountBorrowed;
          }
        });
      }
    });

    return amountToBeReceived;
  };

  const amountToBeReceived = selectedGroupDetails?.expenses
    ? getTotalAmountToBeReceived(selectedGroupDetails?.expenses)
    : 0;

  // total amount to return
  const getTotalAmountToBeReturned = (expenses: Expense[]): number => {
    let amountToBeReturned = 0;

    expenses.forEach((expense) => {
      expense.borrowers.forEach((borrower) => {
        if (
          borrower.user === userInfo?.user._id &&
          !borrower.isApprovedByLender
        ) {
          amountToBeReturned += borrower.amountBorrowed;
        }
      });
    });

    return amountToBeReturned;
  };

  const amountToBeReturned = selectedGroupDetails?.expenses
    ? getTotalAmountToBeReturned(selectedGroupDetails?.expenses)
    : 0;

  return (
    <Layout>
      <div className={styles.personalExpenseHeading}>
        <Typography.Title level={4}>Your Personal Expenses</Typography.Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Spin spinning={isSelectedGroupFetching}>
              <Statistic
                title="Amount you have to receive from others"
                precision={2}
                value={getFormattedCurrencyString({
                  amount: amountToBeReceived,
                })}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowUpOutlined />}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Spin spinning={isSelectedGroupFetching}>
              <Statistic
                title="Amount you have to return to others"
                precision={2}
                value={getFormattedCurrencyString({
                  amount: amountToBeReturned,
                })}
                valueStyle={{ color: "#cf1322" }}
                // prefix={<ArrowDownOutlined />}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Tabs
        centered
        className={styles.personalExpensesTabs}
        defaultActiveKey="1"
      >
        <Tabs.TabPane tab="Amount to be received" key="1">
          <TabAmountToReceive />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Amount to be returned" key="2">
          <TabAmountToReturn />
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default PersonalExpenses;
