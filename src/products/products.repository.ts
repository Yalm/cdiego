import { Product } from "./entities/product.entity";
import { Repository, EntityRepository } from "typeorm";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    paginate(filter: { search: string, category: string, limit: number, skip: number }): Promise<[Product[], number]> {
        let query = this.createQueryBuilder('product')
            .innerJoinAndSelect("product.category", "category");
        if (filter.search) {
            query = query.where("product.name ILIKE :name", { name: `%${filter.search}%` });
        }

        if (filter.category) query = query.andWhere("category.name like :category", filter);
        return Promise.all([
            query.limit(filter.limit || 9).offset(filter.skip || 0).orderBy('product.createdAt', 'DESC').getMany(),
            query.getCount()
        ]);
    }
}
