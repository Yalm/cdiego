import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateRepository } from './state.repository';
import { State } from './entities/state.entity';
import { StatesController } from './states.controller';
// import { StatesService } from './states.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            State,
            StateRepository
        ])
    ],
    // providers: [StatesService],
    controllers: [StatesController]
})
export class StatesModule { }
