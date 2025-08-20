import express, { Router } from "express";
import sequelize, { Sequelize } from "sequelize";
import { initBrand, modelName } from "./infras/repository/dto";
import { BrandUseCase } from "./use-case";
import { BrandRepo } from "./infras/repository/repo";
import { BrandHttpRequest } from "./infras/transport/http-request";
import { CreateBrandCmdHandler } from "./use-case/create-new-brand";

export const setupBrandModule = (sequelize: Sequelize) => {
  initBrand(sequelize);
  const brandRepo = new BrandRepo(sequelize, modelName);
  const brandUseCase = new BrandUseCase(brandRepo);
  const createCmdHandler = new CreateBrandCmdHandler(brandRepo);
  const brandHttpRequest = new BrandHttpRequest(createCmdHandler, brandUseCase);
  const router = Router();
  router.post("/", brandHttpRequest.createAPI.bind(brandHttpRequest));
  return router;
};
