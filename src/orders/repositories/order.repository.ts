import { Repository, EntityRepository } from "typeorm";
import { Order } from "../entities/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    paginate(filter: { search: string, skip: number, take: number, order: any, where: any }): Promise<[Order[], number]> {
        let query = this.createQueryBuilder('orders')
            .innerJoinAndSelect("orders.customer", "customers")
            .innerJoinAndSelect("orders.state", "states")
        if (filter.search) {
            query = query.where("states.name like :search", { search: `${filter.search}%` })
                .orWhere('CAST(orders.id AS text) = :search', filter)
                .orWhere('customers.name like :search', { search: `${filter.search}%` });
        }

        if (filter.where && filter.where.customer) {
            query = query.where("orders.customerId = :id", { id: filter.where.customer });
        }

        if (filter.order) {
            const firstKey = Object.keys(filter.order)[0];
            query = query.orderBy(firstKey, filter.order[firstKey].toUpperCase());
        }

        return Promise.all([
            query.limit(filter.take).offset(filter.skip).getMany(),
            query.getCount()
        ]);
    }

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
            query.limit(filter.take).offset(filter.skip).orderBy('orders.createdAt', 'DESC').getMany(),
            query.getCount()
        ]);
    }

    topCustomer(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.createQueryBuilder('orders')
            .select('COUNT("customerId")', "purchases")
            .addSelect(['customers.name as name', 'customers.surnames as surnames', 'customers.phone as phone', 'customers.email as email'])
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
            query.limit(filter.take).offset(filter.skip).orderBy("purchases", 'DESC').getRawMany(),
            query.getCount()
        ]);
    }
}
