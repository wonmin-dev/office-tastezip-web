import { customFetch } from "@/lib/custom-fetch";
import type { SignUpSchema } from "@/modules/auth/ui/sections/sign-up-form-section";

type emailVerifyReq = {
  email: string;
};

export const postEmailVerify = async (data: emailVerifyReq) => {
  return await customFetch("/auth/email/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

type VerifyCheckReq = {
  email: string;
  code: string;
};

export const postVerifyCheck = async (data: VerifyCheckReq) => {
  return await customFetch("/auth/email/verify/check", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

type SignUpReq = Omit<SignUpSchema, "code">;

export const postSignUp = async (data: SignUpReq) => {
  return await customFetch("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
