import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./repositories/order.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingRepository, OrderDetailRepository } from "./repositories";
import { CreateOrderDto } from "./dto";
import { ProductsService } from "src/products/products.service";
import { PaymentsService } from "src/payments/payments.service";

@Injectable()
export class OrdersService {

    constructor(
        private readonly productsService: ProductsService,
        @InjectRepository(OrderRepository) private readonly orderRepository: OrderRepository,
        private readonly paymentsService: PaymentsService,
        @InjectRepository(OrderDetailRepository) private readonly orderDetailRepository: OrderDetailRepository,
        @InjectRepository(ShippingRepository) private readonly shippingRepository: ShippingRepository
    ) { }

    async store(customerId: number, data: CreateOrderDto) {
        let amount = data.items.reduce((total, { price, quantity }) => total += price * quantity, 0);

        if (data.shipping) {
            amount += data.department === 3655 ? 10 : 30;
        }

        const order = await this.orderRepository.save({
            customer: customerId,
            amount, state: 2,
            description: data.description
        } as any);

        await this.paymentsService.store({
            order,
            amount,
            referenceCode: '',
            paymentType: 1
        } as any);

        if (data.shipping) {
            await this.shippingRepository.save({
                order,
                departament: data.department,
                province: data.province,
                price: data.department === 3655 ? 10 : 30
            });
        }

        await this.orderDetailRepository.save(data.items.map(item => {
            return { orderId: order.id, productId: item.id, quantity: item.quantity };
        }) as any);

        for (const item of data.items) {
            await this.productsService.decrementStock(item);
        }
    }

    topProduct(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.orderDetailRepository
            .createQueryBuilder('order_detail')
            .select(['product.id', 'product.name'])
            .addSelect("SUM(order_detail.quantity)", "quantity")
            .innerJoin("order_detail.product", "product")
            .innerJoin("order_detail.order", "order")
            .where("order.stateId = :state", { state: 2 });
        if (filter.date_init) {
            query = query.andWhere('order.createdAt >= :date_init', filter)
                .andWhere('order.createdAt < :date_end', filter);
        }
        return Promise.all([
            query.limit(filter.take).offset(filter.skip).orderBy("quantity", 'DESC').getMany(),
            query.getCount()
        ]);
    }

    purchases(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        let query = this.orderRepository
            .createQueryBuilder('order')
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
        let query = this.orderRepository
            .createQueryBuilder('order')
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
