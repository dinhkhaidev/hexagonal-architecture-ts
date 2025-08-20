import { z } from "zod";
import { ModelCategory } from "../../../share/model/base-model";

//business model
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).nullable().optional(),
  image: z.string().url().nullable().optional(),
  position: z.number().min(0, "invalid position").optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelCategory).optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()).optional(),
});
export type CategoryDTO = z.infer<typeof CategorySchema>;
