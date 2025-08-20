import { v7 } from "uuid";
import { ModelCategory } from "../../../share/model/base-model";
import { ICategoryUsecase, IRepository } from "../interface";
import {
  CategoryCondDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../model/dto";
import { CategoryDTO } from "../model/model";
import { PagingDTO } from "../../../share/model/paging";
import { NotFoundError } from "../../../share/model/base-error";
import { Op } from "sequelize";

export class CategoryUseCase implements ICategoryUsecase {
  constructor(private readonly repository: IRepository) {}
  async createANewCategory(data: CategoryCreateDTO): Promise<string> {
    const newId = v7();
    const category: CategoryDTO = {
      id: newId,
      name: data.name,
      description: data.description || null,
      image: data.image || null,
      position: 0,
      parentId: data.parentId || null,
      status: ModelCategory.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.insert(category);
    return newId;
  }
  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const category = await this.repository.update(id, data);
    return category;
  }
  async getCategory(id: string): Promise<CategoryDTO | null> {
    const category = await this.repository.get(id);
    if (!category || category.status === ModelCategory.DELETED) {
      NotFoundError();
    }
    return category;
  }
  async listCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Array<CategoryDTO>> {
    return await this.repository.list(cond, paging);
  }
  async deleteCategory(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
