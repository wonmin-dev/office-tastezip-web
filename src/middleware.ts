import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const matchersForAuth = ["/"];
const matchersForSignIn = ["/sign-up/*", "/sign-in/*"];
export async function middleware(request: NextRequest) {
  if (isMatch(request.nextUrl.pathname, matchersForAuth)) {
    return (await auth())
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (isMatch(request.nextUrl.pathname, matchersForSignIn)) {
    return (await auth())
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }
  return NextResponse.next();
}

function isMatch(pathname: string, urls: string[]) {
  return urls.some((url) => url.startsWith(pathname));
}
