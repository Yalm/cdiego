import { TreeRepository, EntityRepository } from "typeorm";
import { Category } from "./entities/category.entity";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> { }
