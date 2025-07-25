'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { notEmpty } from '@/lib/utils';
import { emailVerifyOptions, verifyCheckOptions } from '@/modules/auth/server/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFunnel } from '@use-funnel/browser';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import z from 'zod';

type SignUpStep = {
  SignUp: {
    email?: string;
    password?: string;
    confirm?: string;
  };
  AuthenticateEmail: {
    email: string;
    password: string;
    confirm: string;
    code?: string;
  };
  CreateAccount: {
    email: string;
    password: string;
    confirm: string;
    code: string;
    name?: string;
    duty?: string;
    position?: string;
    employmentYear?: string;
  };
  TermsAgreement: {
    email: string;
    password: string;
    confirm: string;
    code: string;
    name: string;
    duty: string;
    position: string;
    employmentYear: string;
    useCondition?: boolean;
    receivingMarketingInfo?: boolean;
  };
};

const signUpSchema = z.object({
  email: z.email({ error: '이메일을 입력해주세요.' }),
  password: z.string().pipe(notEmpty('비밀번호를 입력해주세요.')),
  confirm: z.string().pipe(notEmpty('비밀번호를 입력해주세요.')),
  code: z.string().regex(/^\d+$/).pipe(notEmpty('인증번호를 입력해주세요.')),
  name: z.string().pipe(notEmpty('이름을 입력해주세요.')),
  duty: z.string().pipe(notEmpty('직무를 선택해주세요.')),
  position: z.string().pipe(notEmpty('직급을 선택해주세요.')),
  employmentYear: z.string().pipe(notEmpty('입사년도를 선택해주세요.')),
  useCondition: z.boolean(),
  receivingMarketingInfo: z.boolean(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

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
      confirm: '',
      code: '',
      name: '',
      duty: 'developer',
      position: '1',
      employmentYear: currentYear,
      receivingMarketingInfo: false,
      useCondition: false,
    },
  });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const onSubmit = (data: SignUpSchema) => {
    console.log(data);
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
                  onNext={(email, password, confirm) =>
                    history.push('AuthenticateEmail', { email, password, confirm })
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
                  onNext={(name, duty, position, employmentYear) =>
                    history.push('TermsAgreement', { name, duty, position, employmentYear })
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
  onNext: (email: string, password: string, confirm: string) => void;
}

const SignUp = ({ onNext }: SignUpProps) => {
  const { control, getValues, trigger, setError } = useFormContext<SignUpSchema>();

  const proceedToNext = async () => {
    const isValid = await trigger(['email', 'password', 'confirm']);

    if (isValid) {
      const email = getValues('email');
      const password = getValues('password');
      const confirm = getValues('confirm');

      if (password !== confirm) {
        setError('confirm', { message: '비밀번호가 일치하지 않습니다.' });
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
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirm"
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
  const emailVerifyMutate = useMutation(emailVerifyOptions);
  const verifyCheckMutate = useMutation(verifyCheckOptions);

  const proceedToNext = async () => {
    const isValid = await trigger(['code']);
    if (isValid) {
      const code = getValues('code');

      // TODO: 이메일 인증번호 발송 기능 적용
      onNext(code);

      // verifyCheckMutate.mutate(
      //   { code, email },
      //   {
      //     onSuccess: () => {
      //       onNext(code);
      //     },
      //   },
      // );
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
          onClick={() => emailVerifyMutate.mutate({ email })}
          className="hover:cursor-pointer"
          disabled
        >
          인증번호 발송
        </Button>
      </div>
      <Button type="button" onClick={proceedToNext}>
        다음
      </Button>
    </div>
  );
};

interface CreateAccountProps {
  onNext: (name: string, duty: string, position: string, employmentYear: string) => void;
  currentYear: string;
}

const CreateAccount = ({ onNext, currentYear }: CreateAccountProps) => {
  const { control, trigger, getValues } = useFormContext<SignUpSchema>();

  const proceedToNext = async () => {
    const isValid = await trigger(['name', 'duty', 'position', 'employmentYear']);

    if (isValid) {
      const name = getValues('name');
      const duty = getValues('duty');
      const position = getValues('position');
      const employmentYear = getValues('employmentYear');

      onNext(name, duty, position, employmentYear);
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">계정 생성하기</h2>
      <FormField
        name="name"
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
        name="duty"
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
                <SelectItem value="developer">개발자</SelectItem>
                <SelectItem value="cooker">요리사</SelectItem>
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
                <SelectItem value="1">사원</SelectItem>
                <SelectItem value="2">대리</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="employmentYear"
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
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">약관 동의하기</h2>
      <Button type="submit">다음</Button>
    </div>
  );
};
