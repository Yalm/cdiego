import {
    Controller,
    Get,
    Body,
    Post,
    Param,
    Put,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile
} from "@nestjs/common";
import { ProductRepository } from "./products.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateResult, DeleteResult, DeepPartial, FindOneOptions, FindManyOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Product } from "./entities/product.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import MulterGoogleCloudStorage from 'multer-google-storage';
import { resolve } from 'path';

@Controller("products")
export class ProductsController {
    constructor(
        @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository
    ) { }

    @Get('count')
    count(
        @Query() query: FindManyOptions<Product>
    ): Promise<number> {
        return this.productRepository.count(query);
    }

    @Get()
    findAll(@Query() query: { search: string, category: string, limit: number, skip: number }): Promise<[Product[], number]> {
        return this.productRepository.paginate(query);
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('cover', {
        storage: new MulterGoogleCloudStorage({
            projectId: 'cdiego-cad55',
            keyFilename: resolve('cdiego.json'),
            bucket: 'cdiego-cad55.appspot.com',
            acl: 'publicread'
        } as any)
    }))
    upload(@Param("id") id: number, @UploadedFile() file: Express.Multer.File): Promise<UpdateResult> {
        return this.productRepository.update(id, { cover: file.path });
    }

    @Post()
    create(@Body() product: DeepPartial<Product>): Promise<Product> {
        delete product.cover;
        return this.productRepository.save(product);
    }

    @Get(":id")
    findById(@Param("id") id: number, @Query() query: FindOneOptions<Product>): Promise<Product> {
        return this.productRepository.findOneOrFail(id, query);
    }

    @Put(":id")
    updateById(
        @Param("id") id: number,
        @Body() product: QueryDeepPartialEntity<Product>
    ): Promise<UpdateResult> {
        return this.productRepository.update(id, {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            shortDescription: product.shortDescription
        });
    }

    @Delete(":id")
    deleteById(@Param("id") id: string): Promise<DeleteResult> {
        return this.productRepository.delete(id);
    }
}
