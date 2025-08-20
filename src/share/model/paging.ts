import z from "zod";
import { ModelCategory } from "./base-model";

export const PagingSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
  total: z.coerce.number().int().min(0).default(0).optional(),
});
export type PagingDTO = z.infer<typeof PagingSchema>;
