import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sql } from "@/lib/db";
import { ExperimentCreate } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = request.nextUrl;
  const subject = searchParams.get("subject");
  const publishedOnly = searchParams.get("published") !== "false";

  let rows;
  if (subject) {
    rows = await sql`
      SELECT * FROM public.experiments
      WHERE (${publishedOnly} = false OR is_published = true)
        AND subject = ${subject}
      ORDER BY sort_order ASC, created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT * FROM public.experiments
      WHERE ${publishedOnly} = false OR is_published = true
      ORDER BY sort_order ASC, created_at DESC
    `;
  }

  return apiSuccess(rows);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const body = await request.json();
  const parsed = ExperimentCreate.safeParse(body);
  if (!parsed.success) return apiError("Invalid input", 400);

  const d = parsed.data;
  const [row] = await sql`
    INSERT INTO public.experiments (title, subject, topic, description, difficulty, scene_path, sort_order)
    VALUES (${d.title}, ${d.subject}, ${d.topic}, ${d.description ?? null}, ${d.difficulty}, ${d.scene_path}, ${d.sort_order})
    RETURNING *
  `;

  return apiSuccess(row, 201);
}
