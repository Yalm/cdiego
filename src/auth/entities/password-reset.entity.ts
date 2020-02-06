import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class PasswordReset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 191 })
    email: string;

    @Column({ length: 191 })
    token: string;

    @Column()
    expireAt: Date;
}
