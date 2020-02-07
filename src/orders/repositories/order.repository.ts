import { Repository, EntityRepository } from "typeorm";
import { Order } from "../entities/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    purchases(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.createQueryBuilder('orders')
            .innerJoinAndSelect("orders.customer", "customers")
            .innerJoinAndSelect("orders.payment", "payments")
            .innerJoinAndSelect("orders.state", "states")
            .where('orders."stateId" = :state', { state: 2 })
            .innerJoinAndSelect('payments.paymentType', 'paymentType');
        if (filter.date_init) {
            query = query.andWhere('orders."createdAt" >= :date_init', filter)
                .andWhere('orders."createdAt" < :date_end', filter);
        }

        return Promise.all([
            query.limit(filter.take).offset(filter.skip).orderBy('orders."createdAt"', 'DESC').getMany(),
            query.getCount()
        ]);
    }

    topCustomer(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.createQueryBuilder('orders')
            .select(['customers.name', 'customers.surnames', 'customers.phone', 'customers.email'])
            .addSelect('COUNT("customerId")', "purchases")
            .innerJoin("orders.customer", "customers")
            .groupBy('customers.name')
            .addGroupBy('customers.surnames')
            .addGroupBy('customers.phone')
            .addGroupBy('customers.email')
            .addGroupBy('customers.id')
            .where('orders."stateId" = :state', { state: 2 });
        if (filter.date_init) {
            query = query.andWhere('orders."createdAt" >= :date_init', filter)
                .andWhere('orders."createdAt" < :date_end', filter);
        }
        return Promise.all([
            query.limit(filter.take).offset(filter.skip).orderBy("purchases", 'DESC').getMany(),
            query.getCount()
        ]);
    }
}
