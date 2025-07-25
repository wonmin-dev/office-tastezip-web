import { postEmailVerify, postVerifyCheck } from "@/modules/auth/server/api";
import { mutationOptions } from "@tanstack/react-query";

export const emailVerifyOptions = mutationOptions({
  mutationFn: postEmailVerify,
});

export const verifyCheckOptions = mutationOptions({
  mutationFn: postVerifyCheck,
});
