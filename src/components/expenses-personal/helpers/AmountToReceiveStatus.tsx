import { Tag, Tooltip } from "antd";
import { Borrower } from "types";

type AmountToReceiveStatusProps = {
  borrower: Borrower;
};

const AmountToReceiveStatus = ({ borrower }: AmountToReceiveStatusProps) => {
  let expenseStatus: string;
  let tagColor: "error" | "success" | "warning";
  let tooltipContent;

  if (borrower.isApprovedByLender) {
    // ideally we never hit this condition but keeping it here just to be safe
    expenseStatus = "Settled";
    tagColor = "success";
    tooltipContent =
      "You have confirmed receiving this amount back from the borrower.";
  } else if (borrower.isSettled) {
    expenseStatus = "Settlement pending";
    tagColor = "warning";
    tooltipContent =
      "The borrower claims to have paid you back, you can mark this expense as settled if you agree.";
  } else {
    expenseStatus = "Unsettled";
    tagColor = "error";
    tooltipContent = "The borrower hasn't paid you back yet.";
  }

  return (
    <Tooltip title={tooltipContent} placement="left">
      <Tag color={tagColor} style={{ userSelect: "none" }}>
        {expenseStatus}
      </Tag>
    </Tooltip>
  );
};

export default AmountToReceiveStatus;
