import { v7 } from "uuid";
import { ErrorDuplicateName } from "../../../share/model/base-error";
import { CreateCommand, ICommandHandler, IRepository } from "../interface";
import { BrandDTO } from "../model/brand";
import { ModelCategory } from "../../../share/model/base-model";

export class CreateBrandCmdHandler
  implements ICommandHandler<CreateCommand, string>
{
  constructor(private readonly repository: IRepository) {}
  async execute(command: CreateCommand): Promise<string> {
    const { data } = command;
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
}
