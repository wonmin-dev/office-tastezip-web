'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { SignUpSchema } from '@/lib/schema/auth';
import { useFormContext } from 'react-hook-form';

interface SignUpSectionProps {
  onNext: (email: string, password: string, confirmPassword: string) => void;
}

export const SignUpSection = ({ onNext }: SignUpSectionProps) => {
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
