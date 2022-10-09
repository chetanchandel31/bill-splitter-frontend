import { Button, Skeleton, Space, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import moment from "moment";
import { ReactNode } from "react";
import { Expense } from "types";
import { getParticipantDetails } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";

// what data will be used to render a single row
type DataType = {
  key: string;
  expense: string;
  lender: string;
  amount: number;
  recordedAt: number;
};

const columns: ColumnsType<DataType> = [
  {
    title: "Expense",
    dataIndex: "expense",
    key: "expense",
    render: (text, record) => (
      <>
        <div>{text}</div>
        <Typography.Text type="secondary">
          <small>{moment.unix(record.recordedAt / 1000).format("lll")}</small>{" "}
        </Typography.Text>
      </>
    ),
  },
  {
    title: "Lender",
    dataIndex: "lender",
    key: "lender",
    render: (text) => <>{text}</>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text, record) => (
      <>{getFormattedCurrencyString({ amount: record.amount })}</>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        {/* TODO: make something useful */}
        <Button size="small" type="primary">
          confirm
        </Button>
      </Space>
    ),
  },
];

const TabAmountToReturn = () => {
  const { userInfo } = useAuth();

  const {
    isSelectedGroupFetching,
    isSelectedGroupLoading,
    selectedGroupDetails,
  } = useSelectedGroup();

  // filter out from total expenses array
  const relevantExpenses: Expense[] = [];

  selectedGroupDetails?.expenses.forEach((expense) => {
    expense.borrowers.forEach((borrower) => {
      if (
        borrower.user === userInfo?.user._id &&
        !borrower.isApprovedByLender
      ) {
        relevantExpenses.push(expense);
      }
    });
  });

  // build jsx
  let list: ReactNode;

  if (isSelectedGroupLoading) {
    list = <Skeleton paragraph={{ rows: 4 }} />;
  } else {
    const tableData: DataType[] = relevantExpenses.map((expense) => {
      const lenderDetails = getParticipantDetails({
        participantId: expense.lender.user,
        selectedGroupDetails,
      });
      const lender = `${lenderDetails?.name} (${lenderDetails?.email})`;

      const amount =
        expense.borrowers.find(
          (borrower) => borrower.user === userInfo?.user._id
        )?.amountBorrowed ?? 0;

      return {
        amount,
        expense: expense.expenseTitle,
        key: expense._id,
        lender,
        recordedAt: expense.recordedAt,
      };
    });

    list = (
      <Spin spinning={isSelectedGroupFetching}>
        <Table columns={columns} dataSource={tableData} />
      </Spin>
    );
  }

  return <div>{list}</div>;
};

export default TabAmountToReturn;
