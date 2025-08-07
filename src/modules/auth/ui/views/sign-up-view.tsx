'use client';

import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { signUpSchema, type SignUpSchema } from '@/lib/schema/auth';
import { signUpMutationOptions } from '@/modules/auth/server/mutations';
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

  const signUp = useMutation(signUpMutationOptions);

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
