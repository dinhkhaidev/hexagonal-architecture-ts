import z from "zod";
import { ModelCategory } from "../../../share/model/base-model";

export const BrandCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).nullable().optional(),
  image: z.string().url().nullable().optional(),
  tagLine: z.string().uuid().nullable().optional(),
});
export type BrandCreateDTO = z.infer<typeof BrandCreateSchema>;
export const BrandUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).nullable().optional(),
  image: z.string().url().nullable().optional(),
  tagLine: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelCategory).optional(),
});
export type BrandUpdateDTO = z.infer<typeof BrandUpdateSchema>;
export const BrandCondSchema = z.object({
  name: z.string().min(2).max(100),
  tagLine: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelCategory).optional(),
});
export type BrandCondDTO = z.infer<typeof BrandCondSchema>;
