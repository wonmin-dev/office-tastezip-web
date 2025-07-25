import { customFetch } from "@/lib/custom-fetch";

type emailVerifyReq = {
  email: string;
};

export const postEmailVerify = async (data: emailVerifyReq) => {
  return await customFetch("/users/email/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

type VerifyCheckReq = {
  email: string;
  code: string;
};

export const postVerifyCheck = async (data: VerifyCheckReq) => {
  return await customFetch("/users/email/verify/check", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
