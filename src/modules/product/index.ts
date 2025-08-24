import express, { Router } from "express";
import { Sequelize } from "sequelize";
import { ProductRepository } from "./infras/repository/repo";
import { initProduct, modelName } from "./infras/repository/dto";
import { ProductUseCase } from "./use-case";
import { ProductHttpRequest } from "./infras/transport/http-request";
export const setupProductModule = (sequelize: Sequelize) => {
  initProduct(sequelize);
  const productRepo = new ProductRepository(sequelize, modelName);
  const productUseCase = new ProductUseCase(productRepo);
  const productHttp = new ProductHttpRequest(productUseCase);
  const router = Router();
  router.post("/", productHttp.createProductAPI.bind(productHttp));
  router.get("/:id", productHttp.getProductAPI.bind(productHttp));
  return router;
};
