import z from "zod";
import { AuthSchema } from ".";

export const AuthRegisterSchema = AuthSchema.pick({
  email: true,
  name: true,
  password: true,
});
export type AuthRegisterDTO = z.infer<typeof AuthRegisterSchema>;

export const AuthLoginSchema = AuthSchema.pick({
  email: true,
  password: true,
});
export type AuthLoginDTO = z.infer<typeof AuthLoginSchema>;
