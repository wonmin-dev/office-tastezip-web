import { Separator } from '@/components/ui/separator';
import SignInFormSection from '@/modules/auth/ui/sections/sign-in-form-section';
import Link from 'next/link';

export const SignInView = () => {
  return (
    <div className="flex flex-col items-center gap-y-10 min-w-xs">
      <h1 className="text-3xl font-bold mb-5">오피스맛집</h1>

      <SignInFormSection />

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
