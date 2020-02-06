import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from './documents/documents.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { StatesModule } from './states/states.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        TypeOrmModule.forRoot(),
        AuthModule,
        ProductsModule,
        CustomersModule,
        DocumentsModule,
        CategoriesModule,
        OrdersModule,
        StatesModule,
        PaymentsModule,
        ReportsModule,
        UsersModule
    ]
})
export class AppModule { }
