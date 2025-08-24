import { PagingDTO } from "../model/paging";

export interface IUseCase<CreateDTO, UpdateDTO, Entity, CondDTO> {
  create(data: CreateDTO): Promise<string>;
  get(id: string): Promise<Entity | null>;
  getList(cond: CondDTO, paging: PagingDTO): Promise<Array<Entity>>;
  update(id: string, data: UpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface IRepository<Entity, CondDTO, UpdateDTO>
  extends IQueryRepository<Entity, CondDTO>,
    ICommandRepository<Entity, UpdateDTO> {}

export interface IQueryRepository<Entity, CondDTO> {
  get(id: string): Promise<Entity | null>;
  list(cond: CondDTO, paging: PagingDTO): Promise<Array<Entity>>;
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(data: Entity): Promise<boolean>;
  update(id: string, data: UpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
