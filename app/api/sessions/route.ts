import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sql } from "@/lib/db";
import { SessionSave } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = request.nextUrl;
  const experimentId = searchParams.get("experiment_id");
  const activeOnly = searchParams.get("active") !== "false";

  let rows;
  if (experimentId) {
    rows = await sql`
      SELECT * FROM public.experiment_sessions
      WHERE user_id = ${session.userId}
        AND experiment_id = ${experimentId}
        AND (${activeOnly} = false OR ended_at IS NULL)
      ORDER BY started_at DESC
    `;
  } else {
    rows = await sql`
      SELECT * FROM public.experiment_sessions
      WHERE user_id = ${session.userId}
        AND (${activeOnly} = false OR ended_at IS NULL)
      ORDER BY started_at DESC
    `;
  }

  return apiSuccess(rows);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = SessionSave.safeParse(body);
  if (!parsed.success) return apiError("Invalid input", 400);

  const [row] = await sql`
    INSERT INTO public.experiment_sessions (user_id, experiment_id, state)
    VALUES (${session.userId}, ${parsed.data.experiment_id}, ${JSON.stringify(parsed.data.state)})
    RETURNING *
  `;

  return apiSuccess(row, 201);
}
