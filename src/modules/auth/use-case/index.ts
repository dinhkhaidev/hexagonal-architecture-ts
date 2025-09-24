import { v7 } from "uuid";
import { TokenPayload, UserRole } from "../../../share/interface";
import { IAuthRepo, IAuthUseCase } from "../interface";
import { AuthLoginDTO, AuthRegisterDTO } from "../model/dto";
import { ErrUserExisted, ErrUserNotFound } from "../model/error";
import { AuthDTO } from "../model";
import bcrypt from "bcrypt";
export class AuthUseCase implements IAuthUseCase {
  constructor(private readonly repository: IAuthRepo) {}
  async login(data: AuthLoginDTO): Promise<string> {
    //const foundUser= await this.repository.findEmailExisted(data);
    return "1";
  }
  async register(data: AuthRegisterDTO): Promise<string> {
    const foundUser = await this.repository.findEmailExisted(data.email);
    if (foundUser) {
      throw ErrUserExisted;
    }
    const newId = v7();
    const salt = 10;
    const passwordHash = bcrypt.hashSync(data.password, salt);
    const user: AuthDTO = {
      id: newId,
      role: UserRole.ADMIN,
      email: data.email,
      password: passwordHash,
      name: data.name,
      salt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.repository.createUser(user);
    return newId;
  }
  verifyToken(token: string): Promise<TokenPayload> {
    throw new Error("Method not implemented.");
  }
}
