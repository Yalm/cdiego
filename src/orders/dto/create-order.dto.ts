import { Product } from "src/products/entities/product.entity";

export interface Items extends Product {
    quantity: number;
}

export interface CreateOrderDto {
    readonly method: string;
    readonly email: string;
    readonly culqi_token: string;
    readonly shipping: boolean;
    readonly items: Items[];
    readonly departament?: number;
    readonly province?: number;
    readonly description?: string;
}
