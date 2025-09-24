import { DataTypes, Model, Sequelize } from "sequelize";
export const modelName = "Auth";
export class UserPersistedModel extends Model {}
export function initAuth(sequelize: Sequelize) {
  UserPersistedModel.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "pending"),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user", "guest"),
        allowNull: false,
      },
      salt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName,
      tableName: "user_auths",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  sequelize.sync({ alter: true });
}
