import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Document } from 'src/documents/entities/documents.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 191 })
    name: string;

    @Column({ length: 191 })
    surnames: string;

    @Column({ length: 191, unique: true })
    email: string;

    @Column({ length: 191 })
    avatar: string;

    @Column({ length: 191, select: false })
    password: string;

    @Column()
    status: boolean;
}
