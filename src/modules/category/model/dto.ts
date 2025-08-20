import z from "zod";
import { ModelCategory } from "../../../share/model/base-model";

export const CategoryCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  image: z.string().url().nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
});
export type CategoryCreateDTO = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  image: z.string().url().nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelCategory).optional(),
});
export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateSchema>;
export const CategoryCondDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelCategory).optional(),
});
export type CategoryCondDTO = z.infer<typeof CategoryCondDTO>;
