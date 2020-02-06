import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CategoryMigration1580582653745 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'category',
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
                    length: '191',
                    isUnique: true
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '191',
                    isNullable: true
                },
                {
                    name: 'status',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'parentId',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'createdAt',
                    type: 'timestamp'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp'
                }
            ],
            foreignKeys: [{
                columnNames: ['parentId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'category',
                onDelete: 'CASCADE'
            }],
            indices: [{
                columnNames: ['name'],
                isUnique: true
            }]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('category');
    }
}
