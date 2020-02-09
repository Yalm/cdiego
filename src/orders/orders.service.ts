import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { OrderRepository } from "./repositories/order.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingRepository, OrderDetailRepository } from "./repositories";
import { CreateOrderDto, CulqiResponseChargeDto, ContactDto } from "./dto";
import { ProductsService } from "src/products/products.service";
import { PaymentsService } from "src/payments/payments.service";
import { CulqiService } from "./culqi.service";
import { SendGridService } from "@anchan828/nest-sendgrid";
import { orderUser } from "./views/emails/order-user.view";
import { Payload } from "src/auth/interfaces";

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

    async store(customer: Payload, data: CreateOrderDto) {
        const subtotal = data.items.reduce((total, { price, quantity }) => total += price * quantity, 0);
        let amount = subtotal;

        if (data.shipping) {
            amount += data.departament === '3655' ? 10 : 20;
        }

        let culqi: CulqiResponseChargeDto;
        try {
            culqi = await this.culqiService.charge({
                amount: amount * 100,
                currency_code: 'PEN',
                email: customer.email,
                source_id: data.culqi_token
            });
        } catch ({ response }) {
            throw new HttpException(response.data, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const order = await this.orderRepository.save({
            customer: customer.id,
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
                departamentId: parseInt(data.departament),
                provinceId: parseInt(data.province),
                price: data.departament === '3655' ? 10 : 20
            });
        }

        await this.orderDetailRepository.save(data.items.map(item => {
            return { orderId: order.id, productId: item.id, quantity: item.quantity };
        }) as any);

        for (const item of data.items) {
            await this.productsService.decrementStock(item);
        }

        await this.sendGrid.send({
            from: 'pedido@comercialdiego.com',
            to: customer.email,
            templateId: 'd-3598400f5f114a948657acdbde1f796e',
            dynamicTemplateData: {
                name: customer.name,
                subtotal: subtotal.toFixed(2),
                total: amount.toFixed(2),
                id: order.id,
                culqi,
                shipping_price: data.departament === '3655' ? 10 : 20,
                ...data
            }
        });

        await this.sendGrid.send({
            from: 'no-reply@comercialdiego.com',
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

    contact(data: ContactDto) {
        return this.sendGrid.send({
            from: 'no-reply@comercialdiego.com',
            to: 'comercialdiegohyo@gmail.com',
            templateId: 'd-96d2b39f651640ed950a1293dfbf6615',
            dynamicTemplateData: data
        });
    }
}
