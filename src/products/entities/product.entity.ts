import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { OrderToProduct } from 'src/orders/entities/order-detail.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 300 })
    name: string;

    @Column()
    price: number;

    @Column({ length: 191 })
    cover: string;

    @Column()
    stock: number;

    @Column({ length: 400 })
    shortDescription: string;

    @Column()
    description?: string;

    @Column({ default: true })
    status: boolean;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

    @OneToMany(() => OrderToProduct, orderToProduct => orderToProduct.product)
    orderToProducts!: OrderToProduct[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
