import { AxiosError } from "axios";

export type AxiosErrorBillSplitter = AxiosError<{ error?: string }>;

export type User = {
  email: string;
  name: string;
  _id: number;
};

export type UserInfo = {
  token: string;
  user: User;
};

export type Group = {
  groupName: string;
  admins: string[]; // later can be (User | string)[]
  members: string[];
};
