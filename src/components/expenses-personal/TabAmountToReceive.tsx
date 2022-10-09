import { Button, Skeleton, Space, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import moment from "moment";
import { ReactNode } from "react";
import { getParticipantDetails } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";

// what data will be used to render a single row, just focus on making all necessary data available, formatting can happen later
type DataType = {
  key: string;
  expense: string;
  borrower: string;
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
          <small>{moment.unix(record.recordedAt / 1000).format("lll")}</small>
        </Typography.Text>
      </>
    ),
  },
  {
    title: "Borrower",
    dataIndex: "borrower",
    key: "borrower",
    render: (text) => <>{text}</>,
  },
  {
    title: "Amount Lent",
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

const TabAmountToReceive = () => {
  const { userInfo } = useAuth();

  const {
    isSelectedGroupFetching,
    isSelectedGroupLoading,
    selectedGroupDetails,
  } = useSelectedGroup();

  // filter out from total expenses array
  const tableData: DataType[] = [];

  selectedGroupDetails?.expenses.forEach((expense) => {
    if (expense.lender.user === userInfo?.user._id) {
      expense.borrowers.forEach((_borrower) => {
        if (!_borrower.isApprovedByLender) {
          const borrowerDetails = getParticipantDetails({
            participantId: _borrower.user,
            selectedGroupDetails,
          });
          const borrower = `${borrowerDetails?.name} (${borrowerDetails?.email})`;

          tableData.push({
            amount: _borrower.amountBorrowed,
            borrower,
            expense: expense.expenseTitle,
            key: _borrower._id,
            recordedAt: expense.recordedAt,
          });
        }
      });
    }
  });

  // build jsx
  let list: ReactNode;

  if (isSelectedGroupLoading) {
    list = <Skeleton paragraph={{ rows: 4 }} />;
  } else {
    list = (
      <Spin spinning={isSelectedGroupFetching}>
        <Table columns={columns} dataSource={tableData} />
      </Spin>
    );
  }

  return <div>{list}</div>;
};

export default TabAmountToReceive;
