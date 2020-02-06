import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DocumentMigration1580582653743 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'document',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '191'
                },
                {
                    name: 'length',
                    type: 'varchar',
                    length: '20'
                }
            ]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('document');
    }
}
