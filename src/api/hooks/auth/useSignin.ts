import { MutationFunction, useMutation } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, UserInfo } from "types";

export type SuccessResponseSignin = AxiosResponse<UserInfo>;

type PayloadSignin = {
  password: string;
  email: string;
};

type UseSigninParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseSignin) => void;
};

const signIn: MutationFunction<SuccessResponseSignin, PayloadSignin> = ({
  email,
  password,
}) => {
  return API.post<UserInfo>("/sign-in", { email, password });
};

const useSignin = ({ onError, onSuccess }: UseSigninParams) => {
  return useMutation<
    SuccessResponseSignin,
    AxiosErrorBillSplitter,
    PayloadSignin
  >(signIn, {
    onSuccess,
    onError,
  });
};

export default useSignin;
