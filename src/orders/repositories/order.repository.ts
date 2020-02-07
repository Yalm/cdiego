import { Repository, EntityRepository } from "typeorm";
import { Order } from "../entities/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    purchases(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.createQueryBuilder('order')
            .innerJoinAndSelect("order.customer", "customer")
            .innerJoinAndSelect("order.payment", "payment")
            .innerJoinAndSelect("order.state", "states")
            .where("order.stateId = :state", { state: 2 })
            .innerJoinAndSelect("payment.paymentType", "paymentType");
        if (filter.date_init) {
            query = query.andWhere('order.createdAt >= :date_init', filter)
                .andWhere('order.createdAt < :date_end', filter);
        }

        return Promise.all([
            query.limit(filter.take).offset(filter.skip).orderBy("order.createdAt", 'DESC').getMany(),
            query.getCount()
        ]);
    }

    topCustomer(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.createQueryBuilder('order')
            .select(['customer.name', 'customer.surnames', 'customer.phone', 'customer.email'])
            .addSelect("COUNT(customerId)", "purchases")
            .innerJoin("order.customer", "customer")
            .where("order.stateId = :state", { state: 2 });
        if (filter.date_init) {
            query = query.andWhere('order.createdAt >= :date_init', filter)
                .andWhere('order.createdAt < :date_end', filter);
        }
        return Promise.all([
            query.limit(filter.take).offset(filter.skip).orderBy("purchases", 'DESC').getMany(),
            query.getCount()
        ]);
    }
}
