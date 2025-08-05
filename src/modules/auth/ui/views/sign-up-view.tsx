'use client';

import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { notEmpty } from '@/lib/utils';
import { signUpOptions } from '@/modules/auth/server/mutations';
import { AuthenticateEmailSection } from '@/modules/auth/ui/sections/authenticate-email-section';
import { CreateAccountSection } from '@/modules/auth/ui/sections/create-account-section';
import { SignUpSection } from '@/modules/auth/ui/sections/sign-up-section';
import { TermsAgreementSection } from '@/modules/auth/ui/sections/terms-agreement-section';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFunnel } from '@use-funnel/browser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

export const SignUpView = () => {
  const [currentYear, setCurrentYear] = useState<string>('2025');

  const router = useRouter();

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
    signUp.mutate(data, {
      onSuccess: () => {
        toast.success('계정이 생성되었습니다!');
        router.replace('/sign-in');
      },
    });
  };

  return (
    <div className="min-w-xs">
      <Progress value={(funnel.index + 1) * 20} className="absolute top-10 w-[320px]" />
      <Form {...form}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
            <funnel.Render
              SignUp={({ history }) => (
                <SignUpSection
                  onNext={(email, password, confirmPassword) =>
                    history.push('AuthenticateEmail', { email, password, confirmPassword })
                  }
                />
              )}
              AuthenticateEmail={({ history, context }) => (
                <AuthenticateEmailSection
                  email={context.email}
                  onNext={(code) => history.push('CreateAccount', { code })}
                />
              )}
              CreateAccount={({ history }) => (
                <CreateAccountSection
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
              TermsAgreement={() => <TermsAgreementSection />}
            />
          </form>
        </FormProvider>
      </Form>
    </div>
  );
};
