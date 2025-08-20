import z from "zod";
import { ModelCategory } from "../../../share/model/base-model";

export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).nullable().optional(),
  image: z.string().url().nullable().optional(),
  tagLine: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelCategory).optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()).optional(),
});
export type BrandDTO = z.infer<typeof BrandSchema>;
