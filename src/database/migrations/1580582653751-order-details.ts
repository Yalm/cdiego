import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class OrderDetailMigration1580582653751 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'order_detail',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'quantity',
                    type: 'smallint',
                    default: 0
                },
                {
                    name: 'productId',
                    type: 'int'
                },
                {
                    name: 'orderId',
                    type: 'int'
                }
            ],
            foreignKeys: [{
                columnNames: ['orderId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'order',
                onDelete: 'CASCADE'
            },
            {
                columnNames: ['productId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'product',
                onDelete: 'CASCADE'
            }],
        }), true, true);
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('order_detail');
    }
}
