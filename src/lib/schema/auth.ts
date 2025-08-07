import { notEmpty } from "@/lib/utils";
import z from "zod";

export const signInSchema = z.object({
  email: z.email("이메일을 입력해주세요."),
  password: z.string().pipe(notEmpty("비밀번호를 입력해주세요.")),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.email({ error: "이메일을 입력해주세요." }),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(20, "비밀번호는 최대 20자까지 허용됩니다.")
    .regex(/[a-zA-z]/, "영문을 포함해주세요.")
    .regex(/\d/, "숫자을 포함해주세요.")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "특수문자을 포함해주세요.")
    .pipe(notEmpty("비밀번호를 입력해주세요.")),
  confirmPassword: z.string().pipe(notEmpty("비밀번호를 입력해주세요.")),
  code: z.string().pipe(notEmpty("인증번호를 입력해주세요.")),
  nickname: z
    .string()
    .max(20, "이름은 최대 20자까지 허용됩니다.")
    .pipe(notEmpty("이름을 입력해주세요.")),
  organizationName: z.string().pipe(notEmpty("기업명을 입력해주세요.")),
  job: z.string().pipe(notEmpty("직무를 선택해주세요.")),
  position: z.string().pipe(notEmpty("직급을 선택해주세요.")),
  joinYear: z.string().pipe(notEmpty("입사년도를 선택해주세요.")),
  privacyAgree: z.boolean().refine((value) => value === true),
  termsAgree: z.boolean().refine((value) => value === true),
  marketingAgree: z.boolean(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
