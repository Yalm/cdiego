import { Repository, EntityRepository } from "typeorm";
import { OrderToProduct } from "../entities";

@EntityRepository(OrderToProduct)
export class OrderDetailRepository extends Repository<OrderToProduct> {

    topProduct(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.createQueryBuilder('order_details')
            .select(['products.id', 'products.name'])
            .addSelect("SUM(order_details.quantity)", "quantity")
            .innerJoin("order_details.product", "products")
            .innerJoin("order_details.order", "orders")
            .where("orders.stateId = :state", { state: 2 });
        if (filter.date_init) {
            query = query.andWhere('orders.createdAt >= :date_init', filter)
                .andWhere('orders.createdAt < :date_end', filter);
        }
        return Promise.all([
            query.limit(filter.take).offset(filter.skip).orderBy("quantity", 'DESC').getMany(),
            query.getCount()
        ]);
    }
}
