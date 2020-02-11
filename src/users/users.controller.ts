import { Controller, Put, Body, Param, HttpCode, UseGuards, Get, Query, Delete, Post, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AuthGuard } from '@nestjs/passport';
import { FindManyOptions, FindOneOptions, DeleteResult, UpdateResult, Like } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import MulterGoogleCloudStorage from 'multer-google-storage';
import { resolve } from 'path';
import { ChangePasswordDto } from './dto';
import { User as UserD } from '../auth/decorators/user.decorator';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) { }

    @UseGuards(AuthGuard('jwt-user'))
    @Get()
    findAll(
        @Query() query: FindManyOptions<User>
    ): Promise<[User[], number]> {
        if (query['search']) {
            query.where = [
                { name: Like(`%${query['search']}%`) },
                { email: Like(`%${query['search']}%`) }
            ];
        }
        return this.usersService.paginate(query);
    }

    @UseGuards(AuthGuard('jwt-user'))
    @Get(":id")
    findById(@Param("id") id: number, @Query() query: FindOneOptions<User>): Promise<User> {
        return this.usersService.show(id, query);
    }

    @UseGuards(AuthGuard('jwt-user'))
    @Put(":id")
    @HttpCode(204)
    async updateById(
        @Param("id") id: number,
        @Body() createUserDto: QueryDeepPartialEntity<User>
    ): Promise<void> {
        await this.usersService.update(id, createUserDto);
    }

    @UseGuards(AuthGuard('jwt-user'))
    @Patch('password')
    @HttpCode(204)
    changePassword(
        @UserD() { id }: User,
        @Body() data: ChangePasswordDto
    ): Promise<void> {
        return this.usersService.changePassword(id, data);
    }

    @UseGuards(AuthGuard('jwt-user'))
    @Post()
    create(@Body() user: User): Promise<User> {
        delete user.avatar;
        return this.usersService.store(user);
    }

    @UseGuards(AuthGuard('jwt-user'))
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: new MulterGoogleCloudStorage({
            projectId: 'cdiego-cad55',
            keyFilename: resolve('cdiego.json'),
            bucket: 'cdiego-cad55.appspot.com',
            acl: 'publicread'
        } as any)
    }))
    upload(@Param("id") id: number, @UploadedFile() file: Express.Multer.File): Promise<UpdateResult> {
        return this.usersService.update(id, { avatar: file.path });
    }

    @UseGuards(AuthGuard('jwt-user'))
    @Delete(":id")
    deleteById(@Param("id") id: number): Promise<DeleteResult> {
        return this.usersService.destroy(id);
    }
}
