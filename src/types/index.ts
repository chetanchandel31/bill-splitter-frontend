import { AxiosError } from "axios";

export type AxiosErrorBillSplitter = AxiosError<{ error?: string }>;

export type User = {
  email: string;
  name: string;
  _id: string;
};

export type UserInfo = {
  token: string;
  user: User;
};

export type Group = {
  groupName: string;
  admins: string[]; // later can be (User | string)[]
  members: string[];
  _id: string;
};

export type GroupWithMemberDetails = {
  groupName: string;
  admins: User[];
  members: User[];
  _id: string;
};

export type Invite = {
  invitedBy: User;
  invitedTo: Group;
  _id: string;
};
