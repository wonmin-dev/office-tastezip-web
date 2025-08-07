'use client';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { signInSchema, type SignInSchema } from '@/lib/schema/auth';
import { useRouter } from 'next/navigation';

export const SignInView = () => {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    const { email, password } = data;
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result.ok) {
      toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
    } else {
      router.push('/');
    }
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="cursor-pointer mt-5"
          >
            {form.formState.isSubmitting ? <Loader2Icon className="animate-spin" /> : 'Login'}
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
