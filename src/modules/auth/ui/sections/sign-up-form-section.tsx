'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { notEmpty } from '@/lib/utils';
import { JOB_CATEGORIES, POSITION_CATEGORIES } from '@/modules/auth/constants';
import {
  emailVerifyOptions,
  signUpOptions,
  verifyCheckOptions,
} from '@/modules/auth/server/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFunnel } from '@use-funnel/browser';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import z from 'zod';

type SignUpStep = {
  SignUp: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  AuthenticateEmail: {
    email: string;
    password: string;
    confirmPassword: string;
    code?: string;
  };
  CreateAccount: {
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
    nickname?: string;
    organizationName?: string;
    job?: string;
    position?: string;
    joinYear?: string;
  };
  TermsAgreement: {
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
    nickname: string;
    organizationName: string;
    job: string;
    position: string;
    joinYear: string;
    privacyAgree?: boolean;
    marketingAgree?: boolean;
    termsAgree?: boolean;
  };
};

const signUpSchema = z.object({
  email: z.email({ error: '이메일을 입력해주세요.' }),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 최대 20자까지 허용됩니다.')
    .regex(/[a-zA-z]/, '영문을 포함해주세요.')
    .regex(/\d/, '숫자을 포함해주세요.')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, '특수문자을 포함해주세요.')
    .pipe(notEmpty('비밀번호를 입력해주세요.')),
  confirmPassword: z.string().pipe(notEmpty('비밀번호를 입력해주세요.')),
  code: z.string().pipe(notEmpty('인증번호를 입력해주세요.')),
  nickname: z
    .string()
    .max(20, '이름은 최대 20자까지 허용됩니다.')
    .pipe(notEmpty('이름을 입력해주세요.')),
  organizationName: z.string().pipe(notEmpty('기업명을 입력해주세요.')),
  job: z.string().pipe(notEmpty('직무를 선택해주세요.')),
  position: z.string().pipe(notEmpty('직급을 선택해주세요.')),
  joinYear: z.string().pipe(notEmpty('입사년도를 선택해주세요.')),
  privacyAgree: z.boolean().refine((value) => value === true),
  termsAgree: z.boolean().refine((value) => value === true),
  marketingAgree: z.boolean(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const SignUpFormSection = () => {
  const [currentYear, setCurrentYear] = useState<string>('2025');

  const funnel = useFunnel<SignUpStep>({
    id: 'signUp',
    initial: {
      step: 'SignUp',
      context: {},
    },
  });

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
      nickname: '',
      organizationName: '',
      job: 'developer',
      position: '1',
      joinYear: currentYear,
      privacyAgree: false,
      termsAgree: false,
      marketingAgree: false,
    },
  });

  const signUp = useMutation(signUpOptions);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const onSubmit = (data: SignUpSchema) => {
    signUp.mutate(data);
  };

  return (
    <>
      <Progress value={(funnel.index + 1) * 20} className="absolute top-10 w-[320px]" />
      <Form {...form}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
            <funnel.Render
              SignUp={({ history }) => (
                <SignUp
                  onNext={(email, password, confirmPassword) =>
                    history.push('AuthenticateEmail', { email, password, confirmPassword })
                  }
                />
              )}
              AuthenticateEmail={({ history, context }) => (
                <AuthenticateEmail
                  email={context.email}
                  onNext={(code) => history.push('CreateAccount', { code })}
                />
              )}
              CreateAccount={({ history }) => (
                <CreateAccount
                  onNext={(nickname, organizationName, job, position, joinYear) =>
                    history.push('TermsAgreement', {
                      nickname,
                      organizationName,
                      job,
                      position,
                      joinYear,
                    })
                  }
                  currentYear={currentYear}
                />
              )}
              TermsAgreement={() => <TermsAgreement />}
            />
          </form>
        </FormProvider>
      </Form>
    </>
  );
};

interface SignUpProps {
  onNext: (email: string, password: string, confirmPassword: string) => void;
}

const SignUp = ({ onNext }: SignUpProps) => {
  const { control, getValues, trigger, setError } = useFormContext<SignUpSchema>();

  const proceedToNext = async () => {
    const isValid = await trigger(['email', 'password', 'confirmPassword']);

    if (isValid) {
      const email = getValues('email');
      const password = getValues('password');
      const confirm = getValues('confirmPassword');

      if (password !== confirm) {
        setError('confirmPassword', { message: '비밀번호가 일치하지 않습니다.' });
      } else {
        onNext(email, password, confirm);
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">가입하기</h2>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>기업 이메일</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>비밀번호</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
            <FormMessage />
            <FormDescription>영문, 숫자, 문자를 포함한 8~20자</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>비밀번호 재확인</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={proceedToNext}>
        다음
      </Button>
    </div>
  );
};

interface AuthenticateEmailProps {
  email: string;
  onNext: (code: string) => void;
}

const AuthenticateEmail = ({ email, onNext }: AuthenticateEmailProps) => {
  const { control, getValues, trigger } = useFormContext<SignUpSchema>();
  const emailVerify = useMutation(emailVerifyOptions);
  const verifyCheck = useMutation(verifyCheckOptions);

  const proceedToNext = async () => {
    const isValid = await trigger(['code']);
    if (isValid) {
      const code = getValues('code');

      verifyCheck.mutate(
        { code, email },
        {
          onSuccess: () => {
            onNext(code);
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">이메일 인증</h2>
      <div className="flex flex-col gap-y-4">
        <FormField
          name="code"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>인증번호</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => emailVerify.mutate({ email })}
          className="hover:cursor-pointer"
          disabled={emailVerify.isPending}
        >
          {emailVerify.isPending ? <Loader2Icon className="animate-spin" /> : '인증번호 발송'}
        </Button>
      </div>
      <Button type="button" onClick={proceedToNext} disabled={verifyCheck.isPending}>
        {verifyCheck.isPending ? <Loader2Icon className="animate-spin" /> : '다음'}
      </Button>
    </div>
  );
};

interface CreateAccountProps {
  onNext: (
    nickname: string,
    organizationName: string,
    job: string,
    position: string,
    joinYear: string,
  ) => void;
  currentYear: string;
}

const CreateAccount = ({ onNext, currentYear }: CreateAccountProps) => {
  const { control, trigger, getValues } = useFormContext<SignUpSchema>();

  const proceedToNext = async () => {
    const isValid = await trigger(['nickname', 'job', 'position', 'joinYear']);

    if (isValid) {
      const nickname = getValues('nickname');
      const organizationName = getValues('organizationName');
      const job = getValues('job');
      const position = getValues('position');
      const joinYear = getValues('joinYear');

      onNext(nickname, organizationName, job, position, joinYear);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">계정 생성하기</h2>
      <FormField
        name="nickname"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>이름</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="job"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>직무</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {JOB_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="position"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>직급</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {POSITION_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="joinYear"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>입사년도</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: Number.parseInt(currentYear) - 1950 + 1 }).map((_, i) => (
                  <SelectItem value={(1950 + i).toString()} key={i}>
                    {1950 + i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={proceedToNext}>
        다음
      </Button>
    </div>
  );
};

const TermsAgreement = () => {
  const [selectAll, setSelectAll] = useState(false);

  const { control, setValue, watch } = useFormContext<SignUpSchema>();

  const [marketingAgree, privacyAgree, termsAgree] = watch([
    'marketingAgree',
    'privacyAgree',
    'termsAgree',
  ]);

  useEffect(() => {
    if (marketingAgree && privacyAgree && termsAgree) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [marketingAgree, privacyAgree, termsAgree]);

  const changeSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setValue('privacyAgree', checked);
    setValue('marketingAgree', checked);
    setValue('termsAgree', checked);
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">약관 동의하기</h2>
      <div className="space-y-3">
        <div className="flex flex-row items-center gap-2">
          <Checkbox checked={selectAll} onCheckedChange={changeSelectAll} />
          <Label className="text-base font-bold">전체 동의</Label>
        </div>
        <Separator />
        <FormField
          name="termsAgree"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-base">
                <span className="text-red-500">(필수)</span>서비스 이용약관 동의
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          name="privacyAgree"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-base">
                <span className="text-red-500">(필수)</span>개인정보 수집 및 이용 동의 여부
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          name="marketingAgree"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="text-base">
                <span>(선택)</span>마케팅 정보 수신 동의
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
      <Button type="submit">다음</Button>
    </div>
  );
};
