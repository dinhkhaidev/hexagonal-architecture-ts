import { DataTypes, Model, Sequelize } from "sequelize";

export const modelName = "Product";

export class ProductPersistentModel extends Model {}

export function initProduct(sequelize: Sequelize) {
  ProductPersistentModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "unisex"),
        allowNull: false,
      },
      images: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: "sale_price",
      },
      colors: {
        type: DataTypes.CHAR(100),
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      brandId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "brand_id",
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "category_id",
      },
      content: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      saleCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "sale_count",
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "deleted"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName,
      tableName: "products",
      timestamps: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
}
