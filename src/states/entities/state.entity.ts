import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class State {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 191, unique: true })
    name: string;

    @Column()
    description?: string;

    @OneToMany(() => Order, order => order.state)
    orders: Order[];
}
