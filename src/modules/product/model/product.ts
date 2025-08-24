import z from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  gender: z.enum(["male", "female", "unisex"]),
  images: z.string().url().nullable().optional(),
  salePrice: z.coerce.number().min(0).nullable().optional(),
  colors: z.string().min(1).nullable().optional(),
  quantity: z.coerce.number().min(0).nullable().optional(),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  content: z.string().max(1000).nullable().optional(),
  rating: z.coerce.number().min(0).max(5).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  saleCount: z.number().min(0).nullable().optional(),
  price: z.coerce.number().min(0).nullable().optional(),
  status: z.enum(["active", "inactive", "deleted"]).default("active"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z
    .date()
    .default(() => new Date())
    .optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductBrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
});
export type ProductBrand = z.infer<typeof ProductBrandSchema>;
export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
});
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
