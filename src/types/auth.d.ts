import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

export declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
