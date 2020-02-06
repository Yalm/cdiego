import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/auth/decorators/user.decorator";
import { DeepPartial } from "typeorm";
import { Payment } from "./entities";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService
    ) { }

    @UseGuards(AuthGuard('jwt-user'))
    @Post()
    create(
        @User() { id },
        @Body() order: DeepPartial<Payment>
    ): Promise<Payment> {
        return this.paymentsService.store(order);
    }
}
