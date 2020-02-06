import { Controller, Get, Query, Post, Body, Param, Put, HttpException, HttpStatus } from "@nestjs/common";
import { CreateCategoryDto } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryRepository } from "./categories.repository";
import { Category } from "./entities/category.entity";
import { FindManyOptions, FindOneOptions, Like, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@Controller("categories")
export class CategoriesController {
    constructor(
        @InjectRepository(CategoryRepository) private readonly categoryRepository: CategoryRepository
    ) { }

    @Get()
    findAll(@Query() query: FindManyOptions<Category>): Promise<Category[]> {
        if (query['search']) {
            query.where = { name: Like(`%${query['search']}%`) };
        }
        return this.categoryRepository.find(query);
    }

    @Get(":id")
    findById(@Param("id") id: number, @Query() query: FindOneOptions<Category>): Promise<Category> {
        return this.categoryRepository.findOneOrFail(id, query);
    }

    @Post()
    async create(
        @Body() createcategoryDto: CreateCategoryDto
    ): Promise<Category> {
        try {
            const data = await this.categoryRepository.save(createcategoryDto);
            return data;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException({ name: 'ER_DUP_ENTRY' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return error;
        }
    }

    @Put(":id")
    async updateById(
        @Param("id") id: number,
        @Body() category: QueryDeepPartialEntity<Category>
    ): Promise<UpdateResult> {
        try {
            const data = await this.categoryRepository.update(id, category);
            return data;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException({ name: 'ER_DUP_ENTRY' }, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return error;
        }
    }
}
