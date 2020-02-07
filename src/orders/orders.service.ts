import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./repositories/order.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingRepository, OrderDetailRepository } from "./repositories";
import { CreateOrderDto } from "./dto";
import { ProductsService } from "src/products/products.service";
import { PaymentsService } from "src/payments/payments.service";
import { CulqiService } from "./culqi.service";
import { SendGridService } from "@anchan828/nest-sendgrid";
import { orderUser } from "./views/emails/order-user.view";

@Injectable()
export class OrdersService {

    constructor(
        private readonly productsService: ProductsService,
        private readonly culqiService: CulqiService,
        private readonly sendGrid: SendGridService,
        @InjectRepository(OrderRepository) private readonly orderRepository: OrderRepository,
        private readonly paymentsService: PaymentsService,
        @InjectRepository(OrderDetailRepository) private readonly orderDetailRepository: OrderDetailRepository,
        @InjectRepository(ShippingRepository) private readonly shippingRepository: ShippingRepository
    ) { }

    async store(customerId: number, data: CreateOrderDto) {
        let amount = data.items.reduce((total, { price, quantity }) => total += price * quantity, 0);

        if (data.shipping) {
            amount += 10;
        }

        const { data: culqi } = await this.culqiService.charge({
            amount: amount * 100,
            currency_code: 'PEN',
            email: data.email,
            source_id: data.culqi_token
        });

        const order = await this.orderRepository.save({
            customer: customerId,
            amount, state: 2,
            description: data.description
        } as any);

        await this.paymentsService.store({
            order,
            amount,
            referenceCode: culqi.id,
            paymentType: 1
        } as any);

        if (data.shipping) {
            await this.shippingRepository.save({
                order,
                departamentId: data.departament,
                provinceId: data.province,
                price: 10
            });
        }

        await this.orderDetailRepository.save(data.items.map(item => {
            return { orderId: order.id, productId: item.id, quantity: item.quantity };
        }) as any);

        for (const item of data.items) {
            await this.productsService.decrementStock(item);
        }

        await this.sendGrid.send({
            from:  'no-reply@comercialdiego.com',
            to: 'comercialdiegohyo@gmail.com',
            subject: 'Nuevo pedido',
            html: orderUser(order)
        });
    }

    topProduct(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        return this.orderDetailRepository.topProduct(filter);
    }

    purchases(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        return this.orderRepository.purchases(filter);
    }

    topCustomer(filter: { date_init: string, date_end: string, skip: number, take: number }): Promise<[any[], number]> {
        return this.orderRepository.topCustomer(filter);
    }
}
