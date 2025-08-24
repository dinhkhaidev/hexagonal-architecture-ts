import z from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(2).max(100),
  gender: z.enum(["male", "female", "unisex"]).nullable().optional(),
  images: z.string().url().nullable().optional(),
  salePrice: z.number().min(0).nullable().optional(),
  colors: z.string().min(1).nullable().optional(),
  quantity: z.number().min(0).nullable().optional(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  content: z.string().max(1000).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  saleCount: z.number().min(0).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  status: z.enum(["active", "inactive", "deleted"]).default("active"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
});

export type ProductCreateDTO = z.infer<typeof ProductCreateSchema>;

export const ProductUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  gender: z.enum(["male", "female", "unisex"]).nullable().optional(),
  images: z.string().url().nullable().optional(),
  salePrice: z.number().min(0).nullable().optional(),
  colors: z.string().min(1).nullable().optional(),
  quantity: z.number().min(0).nullable().optional(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  content: z.string().max(1000).nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  saleCount: z.number().min(0).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  status: z.enum(["active", "inactive", "deleted"]).default("active"),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
});

export type ProductUpdateDTO = z.infer<typeof ProductUpdateSchema>;
export const ProductCondSchema = z.object({
  name: z.string().min(2).max(100),
  gender: z.enum(["male", "female", "unisex"]).nullable().optional(),
  colors: z.string().min(1).nullable().optional(),
  quantity: z.number().min(0).nullable().optional(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  rating: z.number().min(0).max(5).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  status: z.enum(["active", "inactive", "deleted"]).nullable().optional(),
});
export type ProductCondDTO = z.infer<typeof ProductCondSchema>;
