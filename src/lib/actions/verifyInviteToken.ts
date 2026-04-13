"use server";

import { jwtVerify } from "jose";

export interface InviteTokenPayload {
  userId: string | null;
  licenseKey: string | null;
  role: string | null;
  siteName: string | null;
}

export async function verifyInviteToken(
  token: string,
): Promise<{ data: InviteTokenPayload | null; error: string | null }> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_INVITE_KEY);

    const { payload } = await jwtVerify(token, secret, {
      issuer: "https://s-tec.co.kr",
      audience: "https://s-tec.co.kr",
    });

    return {
      data: {
        userId: (payload.userId as string) ?? null,
        licenseKey: (payload.licenseKey as string) ?? null,
        role: (payload.role as string) ?? null,
        siteName: (payload.siteName as string) ?? null,
      },
      error: null,
    };
  } catch {
    return { data: null, error: "유효하지 않은 초대 링크입니다." };
  }
}
