import { Repository, EntityRepository } from "typeorm";
import { State } from "./entities/state.entity";

@EntityRepository(State)
export class StateRepository extends Repository<State> { }
