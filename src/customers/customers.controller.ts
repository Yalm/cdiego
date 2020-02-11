import { Controller, Put, Body, Param, HttpCode, UseGuards, Get, Query, Delete } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AuthGuard } from '@nestjs/passport';
import { FindManyOptions, FindOneOptions, DeleteResult, Like } from 'typeorm';

@Controller('customers')
export class CustomersController {

    constructor(
        private readonly customersService: CustomersService
    ) { }

    @Get()
    findAll(
        @Query() query: FindManyOptions<Customer>
    ): Promise<[Customer[], number]> {
        if (query['search']) {
            query.where = [
                { name: Like(`%${query['search']}%`) },
                { email: Like(`%${query['search']}%`) }
            ];
        }
        return this.customersService.paginate(query);
    }

    @Get('count')
    count(
        @Query() query: FindManyOptions<Customer>
    ): Promise<number> {
        return this.customersService.count(query);
    }

    @Get(":id")
    findById(@Param("id") id: number, @Query() query: FindOneOptions<Customer>): Promise<Customer> {
        return this.customersService.show(id, query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(":id")
    @HttpCode(204)
    async updateById(
        @Param("id") id: number,
        @Body() createCustomerDto: QueryDeepPartialEntity<Customer>
    ): Promise<void> {
        await this.customersService.update(id, createCustomerDto);
    }

    @Delete(":id")
    deleteById(@Param("id") id: number): Promise<DeleteResult> {
        return this.customersService.delete(id);
    }
}
