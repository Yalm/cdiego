import { Module } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './customers.repository';
import { CustomersService } from './customers.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer, CustomerRepository])
    ],
    providers: [CustomersService],
    controllers: [CustomersController],
    exports: [CustomersService]
})
export class CustomersModule { }
