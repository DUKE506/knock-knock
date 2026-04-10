import { jwtVerify } from "jose";

export const verifyToken = async (token: string) => {
  const data = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_INVITE_KEY),
  );

  return data;
};
