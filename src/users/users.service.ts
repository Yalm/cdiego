import { Repository, UpdateResult, FindConditions, FindOneOptions, FindManyOptions, DeleteResult } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto';
import { genSalt, hash, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: Repository<User>
    ) { }

    paginate(query: FindManyOptions<User>): Promise<[User[], number]> {
        return this.userRepository.findAndCount(query);
    }

    async store(user: User): Promise<User> {
        try {
            const salt = await genSalt(10);
            user.password = await hash(user.password, salt);
            const User = await this.userRepository.save(user);
            return User;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException({ email: 'ER_DUP_ENTRY' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return error;
        }
    }

    show(id: number, query?: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOneOrFail(id, query);
    }

    async update(id: number, updateUserDto: any): Promise<UpdateResult> {
        try {
            if (updateUserDto.password) {
                const salt = await genSalt(10);
                updateUserDto.password = await hash(updateUserDto.password, salt);
            }
            const user = await this.userRepository.update(id, updateUserDto);
            return user;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException({ email: 'ER_DUP_ENTRY' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return error;
        }
    }

    async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
        const user = await this.userRepository.findOne(id, { select: ['password'] });
        if (compareSync(data.password, user.password)) {
            throw new HttpException({ message: 'La nueva contraseña no puede ser igual a su contraseña actual. Por favor, elija una contraseña diferente.' }, HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (!compareSync(data.current_password, user.password)) {
            throw new HttpException({
                message: 'Su contraseña actual no coincide con la contraseña que proporcionó. Inténtalo de nuevo.'
            }, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const salt = await genSalt(10);
        data.password = await hash(data.password, salt);

        await this.userRepository.update(id, { password: data.password });
    }

    destroy(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }

    findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email }, select: ['password', 'avatar', 'id'] });
    }

    updateOne(conditions: FindConditions<User>, data: any): Promise<UpdateResult> {
        return this.userRepository.update(conditions, data);
    }
}
