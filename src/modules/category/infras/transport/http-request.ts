import { Request, Response } from "express";
import { ICategoryUsecase, IRepository } from "../../interface";
import {
  CategoryCondDTO,
  CategoryCondSchema,
  CategoryCreateDTO,
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from "../../model/dto";
import { safeParse } from "zod";
import { PagingSchema } from "../../../../share/model/paging";

export class CategoryHttpRequest {
  constructor(private readonly useCase: ICategoryUsecase) {}
  async createANewCategoryAPI(req: Request, res: Response) {
    const { success, data, error } = CategoryCreateSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid request",
        error: error.message,
      });
    }
    const result = await this.useCase.createANewCategory(data);
    res.status(201).json({ id: result });
  }
  async getCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.useCase.getCategory(id);
    res.status(200).json({ data: result });
  }
  async listCategoriesAPI(req: Request, res: Response) {
    const { success, data, error } = PagingSchema.safeParse(req.query);
    if (!success) {
      return res.status(400).json({
        message: "Invalid request",
        error: error.message,
      });
    }
    const cond = CategoryCondSchema.parse(req.query);
    const result = await this.useCase.listCategories(cond, data);
    res.status(200).json({ data: result });
  }
  async updateCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid request",
        error: error.message,
      });
    }
    const result = await this.useCase.updateCategory(id, data);
    res.status(200).json({ data: result });
  }
  async deleteCategoryAPI(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid request",
        error: error.message,
      });
    }
    const result = await this.useCase.deleteCategory(id);
    res.status(200).json({ data: result });
  }
}
