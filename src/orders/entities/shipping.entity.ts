import { Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Shipping {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price?: number;

    @Column()
    departamentId?: number;

    @Column()
    provinceId?: number;

    @Column()
    districtId: number;

    @OneToOne(() => Order, order => order.shipping)
    @JoinColumn()
    order: Order;
}
