import { Controller, Post, Body, UseGuards, Get, Query, Param, Put } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/auth/decorators/user.decorator";
import { OrderRepository } from "./repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, UpdateResult } from "typeorm";
import { Order } from "./entities";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Controller("orders")
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        @InjectRepository(OrderRepository) private readonly orderRepository: OrderRepository
    ) { }

    @UseGuards(AuthGuard('jwt-user'))
    @Get('count')
    count(
        @Query() query: FindManyOptions<Order>
    ): Promise<number> {
        return this.orderRepository.count(query);
    }

    @Get(":id")
    findById(
        @Param("id") id: number,
        @Query() query: FindOneOptions<Order>
    ): Promise<Order> {
        return this.orderRepository.findOne(id, query);
    }

    @Get()
    async findAll(
        @Query() query: { search: string, skip: number, take: number, order: any }
    ): Promise<[Order[], number]> {
        return this.orderRepository.paginate(query);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @User() { id },
        @Body() order: CreateOrderDto
    ): Promise<void> {
        return this.ordersService.store(id, order);
    }

    @Put(":id")
    updateById(
        @Param("id") id: number,
        @Body() product: QueryDeepPartialEntity<Order>
    ): Promise<UpdateResult> {
        return this.orderRepository.update(id, product);
    }
}
