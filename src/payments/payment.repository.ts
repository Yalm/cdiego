import { Repository, EntityRepository } from "typeorm";
import { Payment } from "./entities/payment.entity";

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {}
