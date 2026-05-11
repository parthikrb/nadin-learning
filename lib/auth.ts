import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const JWKS_URL = `${process.env.BETTER_AUTH_URL}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

interface SessionPayload {
  userId: string;
  sessionId: string;
  email?: string;
  [key: string]: unknown;
}

export async function getSession(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token =
    request.cookies.get("better-auth.session_token")?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["RS256", "ES256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function requireSession(
  session: SessionPayload | null,
): session is SessionPayload {
  return session !== null;
}
