import { v7 } from "uuid";
import { PagingDTO } from "../../../share/model/paging";
import { IProductRepository, IProductUseCase } from "../interface";
import {
  ProductCondDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
} from "../model/dto";
import { Product } from "../model/product";
import { ErrorNotFound } from "../model/error";

export class ProductUseCase implements IProductUseCase {
  constructor(private readonly repo: IProductRepository) {}
  async create(data: ProductCreateDTO): Promise<string> {
    const newId = v7();
    const product: Product = {
      id: newId,
      name: data.name,
      gender: data.gender || "unisex",
      images: data.images || null,
      salePrice: data.salePrice || 0,
      colors: data.colors || null,
      quantity: data.quantity || 0,
      brandId: data.brandId || "",
      categoryId: data.categoryId || "",
      content: data.content || null,
      rating: data.rating || 0,
      description: data.description || null,
      price: data.price || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
    };
    await this.repo.insert(product);
    return newId;
  }
  async get(id: string): Promise<Product | null> {
    const product = await this.repo.get(id);
    if (!product) {
      throw ErrorNotFound;
    }
    return product as Product;
  }
  getList(cond: ProductCondDTO, paging: PagingDTO): Promise<Array<Product>> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: ProductUpdateDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
