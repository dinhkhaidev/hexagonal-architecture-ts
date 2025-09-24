import { Request, Response } from "express";
import { IAuthUseCase } from "../../interface";
import { AuthLoginSchema, AuthRegisterSchema } from "../../model/dto";

export class AuthHttpRequest {
  constructor(private readonly useCase: IAuthUseCase) {}
  async register(req: Request, res: Response) {
    try {
      const { success, data, error } = AuthRegisterSchema.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          message: "Invalid request",
          error: error.message,
        });
      }
      const result = await this.useCase.register(data);
      res.status(201).json({ id: result });
    } catch (error: any) {
      res.status(500).json({ error: error.stack });
    }
  }
}
