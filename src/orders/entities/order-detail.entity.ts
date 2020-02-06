import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { Order } from "./order.entity";

@Entity('order_detail')
export class OrderToProduct {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    orderId!: number;

    @Column()
    productId!: number;

    @Column()
    quantity!: number;

    @ManyToOne(() => Product, product => product.orderToProducts)
    product!: Product;

    @ManyToOne(() => Order, order => order.products)
    order!: Order;
}
