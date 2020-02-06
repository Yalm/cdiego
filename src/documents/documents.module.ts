import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from "./entities/documents.entity";
import { DocumentRepository } from "./documents.repository";
import { DocumentsController } from './documents.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Document, DocumentRepository])
    ],
    controllers: [DocumentsController]
})
export class DocumentsModule { }
