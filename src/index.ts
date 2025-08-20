import express, { Request, Response } from "express";
import { setupCategoryModule } from "./modules/category";
import { config } from "dotenv";
import { sequelize } from "./share/component/sequelize";
import { setupBrandModule } from "./modules/brand";
config();

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/v1/categories", setupCategoryModule(sequelize));
app.use("/v1/brands", setupBrandModule(sequelize));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
