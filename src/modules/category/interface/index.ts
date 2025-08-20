import { PagingDTO } from "../../../share/model/paging";
import {
  CategoryCondDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../model/dto";
import { CategoryDTO } from "../model/model";

export interface ICategoryUsecase {
  createANewCategory(data: CategoryCreateDTO): Promise<string>;
  updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  listCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Array<CategoryDTO>>;
  getCategory(id: string): Promise<CategoryDTO | null>;
  deleteCategory(id: string): Promise<boolean>;
}
export interface IRepository extends ICommandRepository, IQueryRepository {}
export interface ICommandRepository {
  get(id: string): Promise<CategoryDTO | null>;
  list(cond: CategoryCondDTO, paging: PagingDTO): Promise<Array<CategoryDTO>>;
}
export interface IQueryRepository {
  insert(data: CategoryDTO): Promise<boolean>;
  update(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
