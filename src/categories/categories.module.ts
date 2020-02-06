import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './categories.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, CategoryRepository])
    ],
    controllers: [CategoriesController]
})
export class CategoriesModule { }
