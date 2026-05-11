import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sql } from "@/lib/db";
import { ProgressUpsert } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const rows = await sql`
    SELECT up.*, e.title AS experiment_title, e.subject, e.topic
    FROM public.user_progress up
    JOIN public.experiments e ON e.id = up.experiment_id
    WHERE up.user_id = ${session.userId}
    ORDER BY up.updated_at DESC
  `;

  return apiSuccess(rows);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = ProgressUpsert.safeParse(body);
  if (!parsed.success) return apiError("Invalid input", 400);

  const { experiment_id, status, score } = parsed.data;

  const [row] = await sql`
    INSERT INTO public.user_progress (user_id, experiment_id, status, score, attempts, completed_at, updated_at)
    VALUES (
      ${session.userId},
      ${experiment_id},
      ${status},
      ${score ?? null},
      1,
      CASE WHEN ${status} = 'completed' THEN now() ELSE null END,
      now()
    )
    ON CONFLICT (user_id, experiment_id) DO UPDATE SET
      status = EXCLUDED.status,
      score = COALESCE(EXCLUDED.score, public.user_progress.score),
      attempts = public.user_progress.attempts + 1,
      completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN now() ELSE public.user_progress.completed_at END,
      updated_at = now()
    RETURNING *
  `;

  return apiSuccess(row, status === "completed" ? 200 : 201);
}
