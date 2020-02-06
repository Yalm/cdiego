import { Repository, EntityRepository } from "typeorm";
import { Shipping } from "../entities";

@EntityRepository(Shipping)
export class ShippingRepository extends Repository<Shipping> { }
