import { EntityRepository, Repository } from "typeorm";
import { Document } from "./entities/documents.entity";

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> { }
