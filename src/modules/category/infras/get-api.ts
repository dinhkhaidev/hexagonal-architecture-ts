import { Application, Request, Response } from "express";
import { CategoryPersistedModel } from "./repository/dto";

export const getCategoryApi = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoryRecord = await CategoryPersistedModel.findByPk(id);
  if (!categoryRecord) {
    return res.status(404).json({
      message: "Category not found",
      data: [],
    });
  }
  res.status(200).json({
    message: "Data received successfully",
    data: categoryRecord,
  });
};
