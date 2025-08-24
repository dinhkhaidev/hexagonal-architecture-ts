import { Sequelize } from "sequelize";
import { IProductRepository } from "../../interface";
import { ProductCreateDTO } from "../../model/dto";
import { Product, ProductSchema } from "../../model/product";
import { CategoryDTO } from "../../../category/model/model";

export class ProductRepository implements IProductRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async insert(data: ProductCreateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  async get(id: string): Promise<Product | null> {
    const product = await this.sequelize.models[this.modelName].findByPk(id);
    if (!product) {
      return null;
    }
    // return product.get({ plain: true }) as Product;
    return ProductSchema.parse(product.get({ plain: true }));
  }
  list(cond: any, paging: any): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: any): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
