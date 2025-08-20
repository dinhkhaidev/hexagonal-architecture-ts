import { Application, Request, Response } from "express";
import { CategoryPersistedModel, initCategory } from "./repository/dto";
import { safeParse } from "zod";
import { CategoryCreateSchema } from "../model/dto";
import { v7 } from "uuid";

export const createCategoryApi = async (req: Request, res: Response) => {
  const { success, data, error } = CategoryCreateSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid request",
      error: error.message,
    });
  }
  const newId = v7();
  console.log("newId", newId);
  const newCategory = await CategoryPersistedModel.create({
    id: newId,
    ...data,
  });
  res.status(201).json({
    message: "Create category successfully",
    data: newCategory,
  });
};
