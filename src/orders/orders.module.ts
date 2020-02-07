import { Module, HttpModule } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Shipping, OrderToProduct } from './entities';
import { OrderRepository, ShippingRepository, OrderDetailRepository } from './repositories';
import { ProductsModule } from 'src/products/products.module';
import { OrdersService } from './orders.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { CulqiService } from './culqi.service';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ProductsModule,
        PaymentsModule,
        SendGridModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                apikey: configService.get('SENDGRID_API_KEY')
            }),
            inject: [ConfigService]
        }),
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
