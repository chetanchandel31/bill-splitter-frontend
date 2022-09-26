import { Card, Col, Row, Spin, Statistic, Tabs, Typography } from "antd";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import Layout from "helpers/Layout";
import { Expense } from "types";

const PersonalExpenses = () => {
  const { userInfo } = useAuth();
  const { selectedGroupDetails, isSelectedGroupFetching } = useSelectedGroup();

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
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <Typography.Title level={4}>Your personal expenses</Typography.Title>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Spin spinning={isSelectedGroupFetching}>
              <Statistic
                title="Amount you have to receive from others"
                precision={2}
                prefix="₹"
                value={amountToBeReceived}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowUpOutlined />}
              />
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Spin spinning={isSelectedGroupFetching}>
              <Statistic
                title="Amount you have to return to others"
                precision={2}
                prefix="₹"
                value={amountToBeReturned}
                valueStyle={{ color: "#cf1322" }}
                // prefix={<ArrowDownOutlined />}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Tabs centered defaultActiveKey="1">
        <Tabs.TabPane tab="Amount to be received" key="1">
          Amount to be received
        </Tabs.TabPane>
        <Tabs.TabPane tab="Amount to be returned" key="2">
          Amount to be returned
        </Tabs.TabPane>
      </Tabs>

      <pre>{JSON.stringify(selectedGroupDetails?.expenses, null, 2)}</pre>
    </Layout>
  );
};

export default PersonalExpenses;
