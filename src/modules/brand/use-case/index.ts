import { v7 } from "uuid";
import { PagingDTO } from "../../../share/model/paging";
import { ICategoryUsecase } from "../../category/interface";
import {
  CategoryCreateDTO,
  CategoryUpdateDTO,
  CategoryCondDTO,
} from "../../category/model/dto";
import { CategoryDTO } from "../../category/model/model";
import { IBrandUseCase, IRepository } from "../interface";
import { ModelCategory } from "../../../share/model/base-model";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/dto";
import { BrandDTO } from "../model/brand";
import { ErrorDuplicateName } from "../../../share/model/base-error";

export class BrandUseCase implements IBrandUseCase {
  constructor(private readonly repository: IRepository) {}
  async create(data: BrandCreateDTO): Promise<string> {
    const foundName = await this.repository.findName(data.name);
    if (foundName) {
      throw ErrorDuplicateName;
    }
    const newId = v7();
    const brand: BrandDTO = {
      id: newId,
      name: data.name,
      status: ModelCategory.ACTIVE,
      image: data.image || null,
      tagLine: data.tagLine || null,
      description: data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.create(brand);
    return newId;
  }
  getDetail(id: string): Promise<BrandDTO> {
    throw new Error("Method not implemented.");
  }
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<BrandDTO>> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: BrandUpdateDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
