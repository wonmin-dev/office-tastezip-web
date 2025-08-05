'use client';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { rsaKeyQueryOptions } from '@/modules/auth/server/queries';
import { passwordRsaEncrypt } from '@/lib/utils';
import { signInMutationOptions } from '@/modules/auth/server/mutations';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';

const signInSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(1),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const SignInView = () => {
  const router = useRouter();

  const { data: rsaKey } = useQuery(rsaKeyQueryOptions);
  const signIn = useMutation(signInMutationOptions);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInSchema) => {
    const { email, password } = data;
    const encrypted = passwordRsaEncrypt(password, rsaKey);
    signIn.mutate(
      { email, password: encrypted },
      {
        onSuccess: (data) => {
          console.log(data);
          router.push('/');
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-y-10 min-w-xs">
      <h1 className="text-3xl font-bold mb-5">오피스맛집</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Email" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={signIn.isPending} className="cursor-pointer mt-5">
            {signIn.isPending ? <Loader2Icon className="animate-spin" /> : 'Login'}
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-x-2 w-full">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground text-center whitespace-nowrap">또는</span>
        <Separator className="flex-1" />
      </div>

      <p className="text-sm">
        계정이 없으신가요?
        <Link href={'/sign-up'}>
          <span className="text-sm text-blue-500 hover:underline ml-2">가입하기</span>
        </Link>
      </p>
    </div>
  );
};
