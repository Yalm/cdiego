import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentRepository } from "./payment.repository";
import { DeepPartial } from "typeorm";
import { Payment } from "./entities";

@Injectable()
export class PaymentsService {

    constructor(
        @InjectRepository(PaymentRepository) private readonly paymentRepository: PaymentRepository
    ) { }

    store(data: DeepPartial<Payment>):Promise<Payment> {
        return this.paymentRepository.save(data);
    }
}
