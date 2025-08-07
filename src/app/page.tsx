import { SignOutButton } from '@/app/sign-out-button';
import { auth, signOut } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  console.log(session);

  const logOut = () => {
    signOut();
  };

  return (
    <div>
      <Link href={'/sign-in'}>로그인페이지</Link>
      <SignOutButton />
    </div>
  );
}
