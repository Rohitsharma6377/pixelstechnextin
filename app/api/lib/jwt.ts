import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
const alg = "HS256";

export interface JwtPayload {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export async function signToken(payload: JwtPayload, expiresIn = "7d") {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days default
  return await new SignJWT({ ...payload, iat, exp })
    .setProtectedHeader({ alg })
    .setIssuedAt(iat)
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
  return payload as unknown as JwtPayload & { iat: number; exp: number };
}
