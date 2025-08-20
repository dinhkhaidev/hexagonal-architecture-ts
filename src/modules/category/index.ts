import express, { Router } from "express";
import { getCategoryApi } from "./infras/get-api";
import { createCategoryApi } from "./infras/create-api";
import { updateCategoryApi } from "./infras/update-api";
import { deleteCategoryApi } from "./infras/delete-api";
import { initCategory, modelName } from "./infras/repository/dto";
import { Sequelize } from "sequelize";
import { CategoryRepo } from "./infras/repository/repo";
import { CategoryUseCase } from "./use-case";
import { CategoryHttpRequest } from "./infras/transport/http-request";

export const setupCategoryModule = (sequelize: Sequelize) => {
  initCategory(sequelize);
  const categoryRepo = new CategoryRepo(sequelize, modelName);
  const categoryUseCase = new CategoryUseCase(categoryRepo);
  const categoryHttp = new CategoryHttpRequest(categoryUseCase);
  const router = Router();
  router.get("/", categoryHttp.listCategoriesAPI.bind(categoryHttp));
  router.post("/", categoryHttp.createANewCategoryAPI.bind(categoryHttp));
  router.get("/:id", categoryHttp.getCategoryAPI.bind(categoryHttp));
  router.patch("/:id", categoryHttp.updateCategoryAPI.bind(categoryHttp));
  router.delete("/:id", categoryHttp.deleteCategoryAPI.bind(categoryHttp));
  return router;
};
