import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "src/customers/entities/customer.entity";
import { OrderToProduct } from "./order-detail.entity";
import { State } from "src/states/entities/state.entity";
import { Shipping } from "./shipping.entity";
import { Payment } from "src/payments/entities/payment.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 300 })
    description?: string;

    @Column()
    amount?: number;

    @OneToOne(() => Payment, payment => payment.order)
    payment: Payment;

    @ManyToOne(() => State, state => state.orders)
    state: State;

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer;

    @OneToOne(() => Shipping, shipping => shipping.order)
    shipping: Shipping;

    @OneToMany(() => OrderToProduct, orderToProduct => orderToProduct.order)
    products!: OrderToProduct[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
