import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { ReportsController } from './reports.controller';

@Module({
    imports: [
        OrdersModule
    ],
    controllers: [ReportsController]
})
export class ReportsModule { }
