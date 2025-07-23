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
import { zodResolver } from '@hookform/resolvers/zod';
import { useFunnel } from '@use-funnel/browser';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import z from 'zod';

type SignUpStep = {
  SignUp: {
    email?: string;
    password?: string;
  };
  AuthenticateEmail: {
    email: string;
    password: string;
    code?: string;
  };
  CreateAccount: {
    email: string;
    password: string;
    code: string;
    name?: string;
    duty?: string;
    position?: string;
    employmentYear?: string;
  };
  TermsAgreement: {
    email: string;
    password: string;
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
  email: z.email(),
  password: z.string().pipe(notEmpty()),
  confirm: z.string().pipe(notEmpty()),
  name: z.string().pipe(notEmpty()),
  duty: z.string().pipe(notEmpty()),
  position: z.string().pipe(notEmpty()),
  employmentYear: z.string().pipe(notEmpty()),
  useCondition: z.boolean(),
  receivingMarketingInfo: z.boolean(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export const SignUpFormSection = () => {
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
      name: '',
      duty: '',
      position: '',
      employmentYear: '',
      receivingMarketingInfo: false,
      useCondition: false,
    },
  });

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
                  onNext={(email, password) =>
                    history.push('AuthenticateEmail', { email, password })
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
  onNext: (email: string, password: string) => void;
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
        onNext(email, password);
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
  const proceedToNext = () => {
    onNext(email);
  };
  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">이메일 인증</h2>
      <Input />
      <Button type="button" onClick={proceedToNext}>
        다음
      </Button>
    </div>
  );
};

interface CreateAccountProps {
  onNext: (name: string, duty: string, position: string, employmentYear: string) => void;
}

const CreateAccount = ({ onNext }: CreateAccountProps) => {
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
            <FormControl>
              <Input {...field} />
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

const TermsAgreement = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-y-8">
      <h2 className="text-2xl font-bold text-center mb-5">약관 동의하기</h2>
      <Button type="submit">다음</Button>
    </div>
  );
};
