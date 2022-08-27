import { useMutation } from "@tanstack/react-query";
import { API } from "api/API";
import { AxiosError } from "axios";

export type SuccessResponseSignup = {
  aa: "aa";
};

type PayloadSignup = {
  name: string;
  password: string;
  email: string;
};

const useSignup = () => {
  return useMutation<SuccessResponseSignup, AxiosError, PayloadSignup>(
    ({ email, name, password }) => {
      return API.post("/sign-up", { email, name, password });
    }
  );
};

export default useSignup;
