import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "./products.repository";

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository
    ) { }

    decrementStock(data: { id: number, quantity: number }) {
        return this.productRepository.decrement({ id: data.id }, 'stock', data.quantity);
    }
}
