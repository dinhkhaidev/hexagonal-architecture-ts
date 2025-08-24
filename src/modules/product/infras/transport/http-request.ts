import { Request, Response } from "express";
import { IProductUseCase } from "../../interface";
import { ProductCreateSchema } from "../../model/dto";
import { RPCBrandRepository, RPCCategoryRepository } from "../rpc";

export class ProductHttpRequest {
  constructor(private readonly useCase: IProductUseCase) {}
  async createProductAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = ProductCreateSchema.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          message: "Invalid request",
          error: error.message,
          errorDetail: error,
        });
      }
      const result = await this.useCase.create(data);
      res.status(201).json({ id: result });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        errorDetail: error,
      });
    }
  }
  async getProductAPI(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const result = await this.useCase.get(productId);
      console.log("result!.categoryId", result!.categoryId);
      const categoryProduct = await new RPCCategoryRepository(
        "http://localhost:3000/v1"
      ).get(result!.categoryId);
      if (!result) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      res.status(200).json({
        ...result,
        category: categoryProduct || null,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
        errorDetail: error,
      });
    }
  }
}
