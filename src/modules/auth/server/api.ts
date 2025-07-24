import { customFetch } from "@/lib/custom-fetch";

export const postEmailVerify = async (data: { email: string }) => {
  return await customFetch("/users/email/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
