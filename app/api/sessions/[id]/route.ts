import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const [row] = await sql`
    SELECT * FROM public.experiment_sessions
    WHERE id = ${id} AND user_id = ${session.userId}
  `;
  if (!row) return apiError("Not found", 404);

  return apiSuccess(row);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json();

  const [row] = await sql`
    UPDATE public.experiment_sessions
    SET state = ${JSON.stringify(body.state)}, ended_at = ${body.ended_at ?? null}
    WHERE id = ${id} AND user_id = ${session.userId}
    RETURNING *
  `;
  if (!row) return apiError("Not found", 404);

  return apiSuccess(row);
}
