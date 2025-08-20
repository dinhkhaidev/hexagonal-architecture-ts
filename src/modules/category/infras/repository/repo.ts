import { Sequelize } from "sequelize";
import { PagingDTO } from "../../../../share/model/paging";
import { IRepository } from "../../interface";
import { CategoryCondDTO, CategoryUpdateDTO } from "../../model/dto";
import { CategoryDTO, CategorySchema } from "../../model/model";
import { ModelCategory } from "../../../../share/model/base-model";
import { Op } from "sequelize";

export class CategoryRepo implements IRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async get(id: string): Promise<CategoryDTO | null> {
    const category = await this.sequelize.models[this.modelName].findByPk(id);
    if (!category) {
      return null;
    }
    // return category.get({ plain: true }) as CategoryDTO;
    return CategorySchema.parse(category.get({ plain: true }));
  }
  async list(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Array<CategoryDTO>> {
    const { page, limit } = paging;
    const condSQL = { status: { [Op.ne]: ModelCategory.DELETED } };
    const totalCategory = await this.sequelize.models[this.modelName].count({
      where: condSQL,
    });
    paging.total = totalCategory;
    const listCategory = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
    });
    return listCategory.map((category) => category.get({ plain: true }));
  }
  async insert(data: CategoryDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  async update(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const categoryData = await this.sequelize.models[this.modelName].update(
      data,
      {
        where: {
          id,
        },
      }
    );
    return true;
  }
  async delete(id: string): Promise<boolean> {
    const deleteCategory = await this.sequelize.models[this.modelName].destroy({
      where: {
        id,
      },
    });
    return true;
  }
}
