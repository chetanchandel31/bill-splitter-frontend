import { MutationFunction, useMutation } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosResponse } from "axios";
import { AxiosErrorBillSplitter, User } from "types";

export type SuccessResponseSignup = AxiosResponse<User>;

type PayloadSignup = {
  name: string;
  password: string;
  email: string;
};

type UseSignupParams = {
  onError?: (error: AxiosErrorBillSplitter) => void;
  onSuccess?: (data: SuccessResponseSignup) => void;
};

const signUp: MutationFunction<SuccessResponseSignup, PayloadSignup> = ({
  email,
  name,
  password,
}) => {
  return API.post("/sign-up", { email, name, password });
};

const useSignup = ({ onError, onSuccess }: UseSignupParams) => {
  return useMutation<
    SuccessResponseSignup,
    AxiosErrorBillSplitter,
    PayloadSignup
  >(signUp, {
    onSuccess,
    onError,
  });
};

export default useSignup;
