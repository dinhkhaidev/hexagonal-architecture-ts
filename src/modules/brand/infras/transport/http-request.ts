import { Request, Response } from "express";
import { CreateCommand, IBrandUseCase, ICommandHandler } from "../../interface";
import { BrandCreateSchema } from "../../model/dto";

export class BrandHttpRequest {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly usecase: IBrandUseCase
  ) {}
  async createAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = BrandCreateSchema.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          message: "Invalid field!",
          error: error.message,
        });
      }
      const result = await this.createCmdHandler.execute({ data });
      res.status(200).json({
        message: "Create brand successfull!",
        metadata: result,
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}
