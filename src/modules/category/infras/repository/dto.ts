import { DataTypes, Model, Sequelize } from "sequelize";
export const modelName = "Category";
export class CategoryPersistedModel extends Model {
  declare id: string;
}
export function initCategory(sequelize: Sequelize) {
  CategoryPersistedModel.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.STRING,
        field: "parent_id",
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "deleted"),
        allowNull: true,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName,
      tableName: "categories",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
}
