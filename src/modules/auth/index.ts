import { Sequelize } from "sequelize";
import { initAuth, modelName } from "./infras/repository/dto";
import { AuthRepository } from "./infras/repository/repo";
import { AuthUseCase } from "./use-case";
import { AuthHttpRequest } from "./infras/transport/http-request";
import { Router } from "express";

export const setupAuthModule = (sequelize: Sequelize) => {
  initAuth(sequelize);
  const authRepo = new AuthRepository(sequelize, modelName);
  const authUseCase = new AuthUseCase(authRepo);
  const authHttpRequest = new AuthHttpRequest(authUseCase);
  const router = Router();
  router.post("/register", authHttpRequest.register.bind(authHttpRequest));
  return router;
};
