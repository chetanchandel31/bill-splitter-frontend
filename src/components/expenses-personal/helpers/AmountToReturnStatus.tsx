import { Tag, Tooltip } from "antd";
import { Borrower } from "types";

type AmountToReturnStatusProps = {
  borrower: Borrower;
};

const AmountToReturnStatus = ({ borrower }: AmountToReturnStatusProps) => {
  let expenseStatus: string;
  let tagColor: "error" | "success" | "warning";
  let tooltipContent;

  if (borrower.isApprovedByLender) {
    // ideally we never hit this condition but keeping it here just to be safe
    expenseStatus = "Settled";
    tagColor = "success";
    tooltipContent = "You have paid back the borrowed amount.";
  } else if (borrower.isSettled) {
    expenseStatus = "Settlement pending";
    tagColor = "warning";
    tooltipContent =
      "You claimed to have paid this amount back to the lender, but lender hasn't approved yet.";
  } else {
    expenseStatus = "Unsettled";
    tagColor = "error";
    tooltipContent = "You haven't paid back this borrowed amount yet.";
  }

  return (
    <Tooltip title={tooltipContent} placement="left">
      <Tag color={tagColor} style={{ userSelect: "none" }}>
        {expenseStatus}
      </Tag>
    </Tooltip>
  );
};

export default AmountToReturnStatus;
