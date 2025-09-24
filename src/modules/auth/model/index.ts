import z from "zod";
import { UserRole } from "../../../share/interface";
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNKNOWN = "unknown",
}
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  BANNED = "banned",
  DELETED = "deleted",
}
export const AuthSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.int().nullable().optional(),
  status: z.nativeEnum(Status).optional(),
  password: z.string().min(6).max(100),
  role: z.nativeEnum(UserRole),
  salt: z.int().min(8),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type AuthDTO = z.infer<typeof AuthSchema>;
