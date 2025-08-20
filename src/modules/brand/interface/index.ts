import { PagingDTO } from "../../../share/model/paging";
import { BrandDTO } from "../model/brand";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/dto";

export interface IRepository extends ICommandRepository, IQueryRepository {}
export interface ICommandRepository {
  get(id: string): Promise<BrandDTO>;
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<BrandDTO>>;
  findName(name: string): Promise<boolean>;
}
export interface IQueryRepository {
  create(data: BrandCreateDTO): Promise<string>;
  update(id: string, data: BrandUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface IBrandUseCase {
  create(data: BrandCreateDTO): Promise<string>;
  getDetail(id: string): Promise<BrandDTO>;
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<BrandDTO>>;
  update(id: string, data: BrandUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
export interface CreateCommand {
  data: BrandCreateDTO;
}
export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>;
}
export interface IQueryHandler<Query, Result> {
  execute(query: Query): Promise<Result>;
}
