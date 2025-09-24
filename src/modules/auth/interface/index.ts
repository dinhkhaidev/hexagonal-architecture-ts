import { TokenPayload } from "../../../share/interface";
import { AuthDTO } from "../model";
import { AuthLoginDTO, AuthRegisterDTO } from "../model/dto";

export interface IAuthRepo extends IAuthQueryRepo, IAuthCommandRepo {}
export interface IAuthQueryRepo {
  findEmailExisted(email: string): Promise<AuthDTO | null>;
}
export interface IAuthCommandRepo {
  createUser(data: AuthDTO): Promise<string>;
}

export interface IAuthUseCase {
  login(data: AuthLoginDTO): Promise<string>;
  register(data: AuthRegisterDTO): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
}
