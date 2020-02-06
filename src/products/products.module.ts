import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductRepository])
    ],
    providers: [ProductsService],
    exports: [ProductsService],
    controllers: [ProductsController]
})
export class ProductsModule { }
