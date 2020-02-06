import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Customer } from "src/customers/entities/customer.entity";

@Entity()
export class Document {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 191 })
    name: string;

    @Column({ length: 20 })
    length?: string;

    @OneToMany(() => Customer, customer => customer.document)
    customers: Customer[];
}
