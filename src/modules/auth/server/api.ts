import { apiClient } from "@/lib/api-client";
import type { SignUpSchema } from "@/modules/auth/ui/sections/sign-up-form-section";

type emailVerifyReq = {
  email: string;
};

export const postEmailVerify = async (data: emailVerifyReq) => {
  return await apiClient.post("/auth/email/verify", data);
};

type VerifyCheckReq = {
  email: string;
  code: string;
};

export const postVerifyCheck = async (data: VerifyCheckReq) => {
  return await apiClient.post("/auth/email/verify/check", data);
};

type SignUpReq = Omit<SignUpSchema, "code">;

export const postSignUp = async (data: SignUpReq) => {
  return await apiClient.post("/users/register", data);
};

export type OrganizationNamesReq = {
  name: string;
};

type OrganizationNamesRes = { id: string; name: string }[];

export const getOrganizationNames = async (data: OrganizationNamesReq) => {
  const params = new URLSearchParams(data);
  return await apiClient.get<OrganizationNamesRes>(
    `/organizations/name-search?${params.toString()}`
  );
};
