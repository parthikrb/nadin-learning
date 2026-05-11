import { z } from "zod";

export const ExperimentCreate = z.object({
  title: z.string().min(1).max(200),
  subject: z.enum(["physics", "chemistry"]),
  topic: z.string().min(1).max(200),
  description: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).default(1),
  scene_path: z.string().min(1),
  sort_order: z.number().int().default(0),
});

export const ExperimentUpdate = ExperimentCreate.partial().extend({
  is_published: z.boolean().optional(),
});

export const ProgressUpsert = z.object({
  experiment_id: z.string().uuid(),
  status: z.enum(["not_started", "in_progress", "completed"]),
  score: z.number().int().min(0).optional(),
});

export const SessionSave = z.object({
  experiment_id: z.string().uuid(),
  state: z.record(z.string(), z.unknown()),
});
