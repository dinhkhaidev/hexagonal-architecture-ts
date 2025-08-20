import { Sequelize } from "sequelize";
import { PagingDTO } from "../../../../share/model/paging";
import { IBrandUseCase, IRepository } from "../../interface";
import { BrandDTO, BrandSchema } from "../../model/brand";
import {
  BrandCondDTO,
  BrandCreateDTO,
  BrandCreateSchema,
  BrandUpdateDTO,
} from "../../model/dto";

export class BrandRepo implements IRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async findName(name: string): Promise<boolean> {
    // try {
    const newBrand = await this.sequelize.models[this.modelName].findOne({
      where: { name },
    });
    if (!newBrand) return false;
    return true;
  }
  //     } catch (err: any) {
  //       console.error("Query error:", err.message);
  //       return false;
  //     }
  //   }
  get(id: string): Promise<BrandDTO> {
    throw new Error("Method not implemented.");
  }
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<BrandDTO>> {
    throw new Error("Method not implemented.");
  }
  async create(data: BrandCreateDTO): Promise<string> {
    const newBrand = await this.sequelize.models[this.modelName].create(data);
    const parseData = BrandSchema.parse(newBrand.get({ plain: true }));
    console.log("parseData", parseData);
    return parseData.id;
  }
  update(id: string, data: BrandUpdateDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
