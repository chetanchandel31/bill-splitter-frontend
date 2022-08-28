import { message } from "antd";
import { AxiosErrorBillSplitter } from "types";

export const showErrorMessage = (axiosError: AxiosErrorBillSplitter) => {
  message.error(axiosError.response?.data?.error || "network req failed");
};
