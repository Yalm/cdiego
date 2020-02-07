import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ProductMigration1580582653747 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'product',
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
                    length: '300'
                },
                {
                    name: 'cover',
                    type: 'varchar',
                    length: '191',
                    isNullable: true
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    default: 0
                },
                {
                    name: 'stock',
                    type: 'smallint'
                },
                {
                    name: 'shortDescription',
                    type: 'varchar',
                    length: '300'
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'status',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'categoryId',
                    type: 'int'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()'
                }
            ],
            foreignKeys: [{
                columnNames: ['categoryId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'category',
                onDelete: 'CASCADE'
            }]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('product');
    }
}
