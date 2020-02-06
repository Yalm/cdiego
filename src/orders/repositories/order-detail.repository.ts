import { Repository, EntityRepository } from "typeorm";
import { OrderToProduct } from "../entities";

@EntityRepository(OrderToProduct)
export class OrderDetailRepository extends Repository<OrderToProduct> { }
