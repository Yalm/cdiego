import { Module, HttpModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Shipping, OrderToProduct } from './entities';
import { OrderRepository, ShippingRepository, OrderDetailRepository } from './repositories';
import { ProductsModule } from 'src/products/products.module';
import { OrdersService } from './orders.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { CulqiService } from './culqi.service';

@Module({
    imports: [
        ProductsModule,
        PaymentsModule,
        TypeOrmModule.forFeature([
            Order,
            OrderToProduct,
            Shipping,
            OrderRepository,
            OrderDetailRepository,
            ShippingRepository
        ]),
        HttpModule
    ],
    exports: [OrdersService],
    providers: [OrdersService, CulqiService],
    controllers: [OrdersController]
})
export class OrdersModule { }
