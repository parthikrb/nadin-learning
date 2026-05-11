import { type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { sql } from "@/lib/db";
import { ExperimentUpdate } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const [row] = await sql`SELECT * FROM public.experiments WHERE id = ${id}`;
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
  const parsed = ExperimentUpdate.safeParse(body);
  if (!parsed.success) return apiError("Invalid input", 400);

  const d = parsed.data;
  // Use COALESCE for each nullable field so only explicit undefined values skip the update
  const fields = Object.entries(d).filter(([, v]) => v !== undefined);
  if (fields.length === 0) return apiError("No fields to update", 400);

  const [row] = await sql`
    UPDATE public.experiments
    SET
      title = COALESCE(${d.title}, title),
      subject = COALESCE(${d.subject}, subject),
      topic = COALESCE(${d.topic}, topic),
      description = COALESCE(${d.description}, description),
      difficulty = COALESCE(${d.difficulty}, difficulty),
      scene_path = COALESCE(${d.scene_path}, scene_path),
      sort_order = COALESCE(${d.sort_order}, sort_order),
      is_published = COALESCE(${d.is_published}, is_published),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!row) return apiError("Not found", 404);

  return apiSuccess(row);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(request);
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const [row] = await sql`
    DELETE FROM public.experiments WHERE id = ${id} RETURNING id
  `;
  if (!row) return apiError("Not found", 404);

  return apiSuccess({ deleted: id });
}
