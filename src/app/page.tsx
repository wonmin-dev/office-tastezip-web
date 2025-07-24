import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href={'/sign-in'}>로그인페이지</Link>
    </div>
  );
}
