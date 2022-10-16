import { CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Modal,
  Skeleton,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Tooltip from "antd/es/tooltip";
import useExpenseSettle from "api/hooks/expense/useExpenseSettle";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import moment from "moment";
import { ReactNode } from "react";
import { Borrower } from "types";
import { getParticipantDetails, showErrorMessage } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";
import AmountToReturnStatus from "./helpers/AmountToReturnStatus";

// what data will be used to render a single row, just focus on making all necessary data available, formatting can happen later
type DataType = {
  key: string;
  expense: string;
  expenseId: string;
  lender: string;
  amount: number;
  recordedAt: number;
  borrower: Borrower;
};

const TabAmountToReturn = () => {
  const { userInfo } = useAuth();
  const {
    isSelectedGroupFetching,
    isSelectedGroupLoading,
    selectedGroupDetails,
  } = useSelectedGroup();

  const { isLoading: isExpenseSettleLoading, mutate: settleExpense } =
    useExpenseSettle({
      onError: showErrorMessage,
      onSuccess: () => message.success("Expense claimed as settled"),
    });

  const handleConfirm = (record: DataType) => {
    Modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          You are claiming that you have returned{" "}
          <strong>
            {getFormattedCurrencyString({ amount: record.amount })}
          </strong>{" "}
          back to <strong>{record.lender}</strong> for the expense{" "}
          <strong>{record.expense}</strong> ?
        </>
      ),
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        const expenseId = record.expenseId;
        const groupId = selectedGroupDetails?._id;

        if (groupId) {
          settleExpense({ expenseId, groupId });
        }
      },
    });
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
      title: "Amount Borrowed",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => (
        <>{getFormattedCurrencyString({ amount: record.amount })}</>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <AmountToReturnStatus borrower={record.borrower} />
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip
            title={
              record.borrower.isSettled || record.borrower.isApprovedByLender
                ? ""
                : "Claim that you have paid this amount back."
            }
          >
            <Button
              disabled={
                record.borrower.isSettled || record.borrower.isApprovedByLender
              }
              icon={<CheckOutlined />}
              loading={isExpenseSettleLoading}
              onClick={() => handleConfirm(record)}
              shape="circle"
              size="small"
              type="primary"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // filter out from total expenses array
  const tableData: DataType[] = [];

  selectedGroupDetails?.expenses.forEach((expense) => {
    expense.borrowers.forEach((borrower) => {
      if (
        borrower.user === userInfo?.user._id &&
        !borrower.isApprovedByLender
      ) {
        const amount = borrower?.amountBorrowed ?? 0;

        const lenderDetails = getParticipantDetails({
          participantId: expense.lender.user,
          selectedGroupDetails,
        });
        const lender = `${lenderDetails?.name} (${lenderDetails?.email})`;

        tableData.push({
          amount,
          expense: expense.expenseTitle,
          expenseId: expense._id,
          key: borrower._id,
          lender,
          recordedAt: expense.recordedAt,
          borrower,
        });
      }
    });
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

export default TabAmountToReturn;
