'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  emailVerifyMutationOptions,
  verifyCheckMutationOptions,
} from '@/modules/auth/server/mutations';
import type { SignUpSchema } from '@/modules/auth/ui/views/sign-up-view';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

interface AuthenticateEmailSectionProps {
  email: string;
  onNext: (code: string) => void;
}

export const AuthenticateEmailSection = ({ email, onNext }: AuthenticateEmailSectionProps) => {
  const { control, getValues, trigger } = useFormContext<SignUpSchema>();
  const emailVerify = useMutation(emailVerifyMutationOptions);
  const verifyCheck = useMutation(verifyCheckMutationOptions);

  const sendAuthenticate = () => {
    emailVerify.mutate(
      { email },
      { onSuccess: () => toast.success('인증번호가 발송되었습니다. 메일함을 확인해주세요.') },
    );
  };

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
          onClick={sendAuthenticate}
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
