import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ShippingMigration1580582653753 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'shipping',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'orderId',
                    type: 'int'
                },
                {
                    name: 'departamentId',
                    type: 'int'
                },
                {
                    name: 'provinceId',
                    type: 'int'
                },
                {
                    name: 'districtId',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    default: 0
                }
            ],
            foreignKeys: [{
                columnNames: ['orderId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'order',
                onDelete: 'CASCADE'
            }],
        }), true, true);
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('shipping');
    }
}
