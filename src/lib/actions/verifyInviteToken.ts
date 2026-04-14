"use server";

import { jwtVerify } from "jose";

export async function verifyInviteToken(
  token: string,
): Promise<{ data: Record<string, any> | null; error: string | null }> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_INVITE_KEY);

    const { payload } = await jwtVerify(token, secret, {
      issuer: "https://s-tec.co.kr",
      audience: "https://s-tec.co.kr",
    });

    return { data: payload as Record<string, any>, error: null };
  } catch {
    return { data: null, error: "유효하지 않은 초대 링크입니다." };
  }
}
