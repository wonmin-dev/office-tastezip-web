import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";
import JSEncrypt from "jsencrypt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notEmpty = (message = "Required") =>
  z.string().trim().min(1, { message });

export const passwordRsaEncrypt = (password: string, rsaKey?: string) => {
  if (!rsaKey) throw new Error("암호화에 실패했습니다.");

  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(rsaKey);
  const encrypted = encrypt.encrypt(password);

  if (encrypted === false) throw new Error("암호화에 실패했습니다.");

  return encrypted;
};
