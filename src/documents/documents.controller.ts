import { Controller, Get, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Document } from "./entities/documents.entity";
import { FindManyOptions } from "typeorm";
import { DocumentRepository } from "./documents.repository";

@Controller("documents")
export class DocumentsController {
    constructor(
        @InjectRepository(DocumentRepository) private readonly documentRepository: DocumentRepository
    ) { }

    @Get()
    findAll(@Query() query: FindManyOptions<Document>): Promise<Document[]> {
        return this.documentRepository.find(query);
    }
}
