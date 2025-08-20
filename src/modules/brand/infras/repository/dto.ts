import { DataTypes, Model, Sequelize } from "sequelize";

export const modelName = "Brand";
class BrandPersistedModel extends Model {}
export function initBrand(sequelize: Sequelize) {
  BrandPersistedModel.init(
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
      tagLine: {
        type: DataTypes.STRING,
        field: "tag_line",
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
      tableName: "brands",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
}
