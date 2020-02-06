import { Entity, Column, ManyToOne, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { PaymentType } from "./payment-type.entity";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Order, order => order.payment)
    @JoinColumn()
    order: Order;

    @Column()
    amount: number;

    @Column({ length: 191 })
    referenceCode?: string;

    @ManyToOne(() => PaymentType, paymentType => paymentType.payments)
    paymentType: PaymentType;
}
