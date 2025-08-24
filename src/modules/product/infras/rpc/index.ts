import axios from "axios";
import {
  IBrandQueryRepository,
  ICategoryQueryRepository,
} from "../../interface";
import {
  ProductBrand,
  ProductBrandSchema,
  ProductCategory,
  ProductCategorySchema,
} from "../../model/product";

export class RPCBrandRepository implements IBrandQueryRepository {
  constructor(private readonly baseUrl: string) {}
  async get(id: string): Promise<ProductBrand | null> {
    console.log("baseUrl", this.baseUrl);
    const response = await axios.get(`${this.baseUrl}/brands/${id}`);
    console.log("response", response);
    const { success, data, error } = ProductBrandSchema.safeParse(
      response.data
    );
    if (!success) {
      return null;
    }
    return data;
  }
}

export class RPCCategoryRepository implements ICategoryQueryRepository {
  constructor(private readonly baseUrl: string) {}
  async get(id: string): Promise<ProductCategory | null> {
    const response = await axios.get(`${this.baseUrl}/categories/${id}`);
    const { success, data, error } = ProductCategorySchema.safeParse(
      response.data.data
    );
    if (!success) {
      return null;
    }
    return data;
  }
}
