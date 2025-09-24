import { Sequelize } from "sequelize";
import { TokenPayload } from "../../../../share/interface";
import { IAuthRepo } from "../../interface";
import { AuthDTO } from "../../model";
import { AuthLoginDTO, AuthRegisterDTO } from "../../model/dto";

export class AuthRepository implements IAuthRepo {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async findEmailExisted(email: string): Promise<AuthDTO | null> {
    const userRecord = await this.sequelize.models[this.modelName].findOne({
      where: {
        email,
      },
    });
    if (!userRecord) {
      return null;
    }
    return userRecord.dataValues;
  }
  async createUser(data: AuthDTO): Promise<string> {
    const user = await this.sequelize.models[this.modelName].create(data);
    return user.dataValues.id;
  }
}
