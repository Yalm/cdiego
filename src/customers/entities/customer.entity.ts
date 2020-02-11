import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Document } from 'src/documents/entities/documents.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 191 })
    name: string;

    @Column({ length: 191 })
    surnames: string;

    @Column({ length: 191, unique: true })
    avatar: string;

    @Column({ length: 191, unique: true })
    email: string;

    @Column()
    emailVerifiedAt: Date;

    @Column({ length: 191, select: false })
    password: string;

    @Column({ length: 191 })
    phone: string;

    @Column()
    status: boolean;

    @ManyToOne(() => Document, document => document.customers)
    document: Document;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];

    @Column({ length: 191 })
    documentNumber: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
