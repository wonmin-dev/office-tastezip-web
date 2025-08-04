import {
  postEmailVerify,
  postSignUp,
  postVerifyCheck,
} from "@/modules/auth/server/api";
import { mutationOptions } from "@tanstack/react-query";

export const emailVerifyOptions = mutationOptions({
  mutationFn: postEmailVerify,
});

export const verifyCheckOptions = mutationOptions({
  mutationFn: postVerifyCheck,
});

export const signUpOptions = mutationOptions({
  mutationFn: postSignUp,
});
