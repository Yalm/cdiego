import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Payment } from "./payment.entity";

@Entity()
export class PaymentType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 191, unique: true })
    name: string;

    @Column({ length: 191 })
    description?: string;

    @OneToMany(() => Payment, payment => payment.paymentType)
    payments: Payment[];
}
