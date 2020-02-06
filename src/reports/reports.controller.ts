import {
    Controller,
    Get,
    Query
} from "@nestjs/common";
import { Order } from "src/orders/entities";
import { OrdersService } from "src/orders/orders.service";

@Controller("reports")
export class ReportsController {
    constructor(
        private readonly ordersService: OrdersService
    ) { }

    @Get('top-products')
    top(
        @Query() query
    ): Promise<[Order[], number]> {
        return this.ordersService.topProduct(query);
    }

    @Get('customer')
    topCustomer(
        @Query() query
    ): Promise<[Order[], number]> {
        return this.ordersService.topCustomer(query);
    }

    @Get('purchases')
    purchases(
        @Query() query
    ): Promise<[Order[], number]> {
        return this.ordersService.purchases(query);
    }
}
