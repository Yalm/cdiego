import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentType } from './entities';
import { PaymentRepository } from './payment.repository';

@Module({
    imports: [
        ProductsModule,
        TypeOrmModule.forFeature([
            Payment,
            PaymentType,
            PaymentRepository
        ])
    ],
    providers: [PaymentsService],
    exports: [PaymentsService],
    controllers: [PaymentsController]
})
export class PaymentsModule { }
