import { Application, Request, Response } from "express";
import { CategoryUpdateSchema } from "../model/dto";
import { CategoryPersistedModel } from "./repository/dto";

export const updateCategoryApi = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Update category failed",
      error: error.format(),
    });
  }
  await CategoryPersistedModel.update(data, {
    where: {
      id,
    },
  });
  res.status(200).json({
    message: "Update category successfully",
    data,
  });
};
