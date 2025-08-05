import {
  postEmailVerify,
  postSignIn,
  postSignUp,
  postVerifyCheck,
} from "@/modules/auth/server/api";
import { mutationOptions } from "@tanstack/react-query";

export const emailVerifyMutationOptions = mutationOptions({
  mutationFn: postEmailVerify,
});

export const verifyCheckMutationOptions = mutationOptions({
  mutationFn: postVerifyCheck,
});

export const signUpMutationOptions = mutationOptions({
  mutationFn: postSignUp,
});

export const signInMutationOptions = mutationOptions({
  mutationFn: postSignIn,
});
