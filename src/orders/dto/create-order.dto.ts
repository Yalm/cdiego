import { Product } from "src/products/entities/product.entity";

export interface Items extends Product {
    quantity: number;
}

export interface CreateOrderDto {
    readonly method: string;
    readonly shipping: boolean;
    readonly items: Items[];
    readonly department?: number;
    readonly province?: number;
    readonly description?: string;
}
