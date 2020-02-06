import { Controller, Get, Query } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { State } from "./entities/state.entity";
// import { StatesService } from "./states.service";
import { StateRepository } from "./state.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Controller("states")
export class StatesController {
   constructor(
        @InjectRepository(StateRepository) private readonly stateRepository: StateRepository
    ) { }

    @Get()
    findAll(
        @Query() query: FindManyOptions<State>
    ): Promise<State[]> {
        return this.stateRepository.find(query);
    }
}
