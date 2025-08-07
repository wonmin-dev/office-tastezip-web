import { signInSchema } from "@/lib/schema/auth";
import { passwordRsaEncrypt } from "@/lib/utils";
import { getRsaKey, postSignIn } from "@/modules/auth/server/api";
import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const { data: rsaKey } = await getRsaKey();

          const encrypted = passwordRsaEncrypt(password, rsaKey);

          const { data: user } = await postSignIn({
            email: email,
            password: encrypted,
          });

          return {
            id: user.email,
            email: user.email,
            name: user.nickname,
            accessToken: user.accessToken,
          };
        } catch (error) {
          console.error(error);
          throw new CredentialsSignin("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    signIn: async () => {
      return true;
    },
    jwt: async ({ token, user }) => {
      return token;
    },
    session: async ({ session, token }) => {
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
});
