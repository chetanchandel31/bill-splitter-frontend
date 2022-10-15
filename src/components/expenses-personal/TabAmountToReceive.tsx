import { CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Skeleton,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import moment from "moment";
import { ReactNode } from "react";
import { Borrower } from "types";
import { getParticipantDetails } from "utils";
import { getFormattedCurrencyString } from "utils/getFormattedCurrencyString";
import AmountToReceiveStatus from "./helpers/AmountToReceiveStatus";

// what data will be used to render a single row, just focus on making all necessary data available, formatting can happen later

type DataType = {
  key: string;
  expense: string;
  borrower: Borrower;
  borrowerNameAndEmail: string;
  amount: number;
  recordedAt: number;
};

const handleConfirm = (record: DataType) => {
  Modal.confirm({
    title: "Are you sure?",
    icon: <ExclamationCircleOutlined />,
    content: (
      <>
        You are confirming that you have received{" "}
        <strong>{getFormattedCurrencyString({ amount: record.amount })}</strong>{" "}
        back from <strong>{record.borrowerNameAndEmail}</strong> for the expense{" "}
        <strong>{record.expense}</strong> ? This expense will be marked as{" "}
        <Tag color="success">Settled</Tag>.
      </>
    ),
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      console.log("fire api call 🚀");
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
          <small>{moment.unix(record.recordedAt / 1000).format("lll")}</small>
        </Typography.Text>
      </>
    ),
  },
  {
    title: "Borrower",
    dataIndex: "borrowerNameAndEmail",
    key: "borrowerNameAndEmail",
    render: (text, record) => <>{text}</>,
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
    title: "Status",
    key: "status",
    render: (_, record) => <AmountToReceiveStatus borrower={record.borrower} />,
  },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Mark this expense as settled">
          <Button
            icon={<CheckOutlined />}
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
            borrower: _borrower,
            borrowerNameAndEmail: borrower,
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
