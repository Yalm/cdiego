import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Product } from "src/products/entities/product.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    status: boolean;

    @Column({ length: 191, unique: true })
    name: string;

    @Column()
    description?: string;

    @ManyToOne(() => Category, category => category.children)
    parent: Category;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
