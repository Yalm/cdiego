import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserRepository])
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }
