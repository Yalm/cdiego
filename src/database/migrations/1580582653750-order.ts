import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class OrderMigration1580582653750 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'order',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '300'
                },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 8,
                    scale: 2
                },
                {
                    name: 'customerId',
                    type: 'int'
                },
                {
                    name: 'stateId',
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
                columnNames: ['customerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customer',
                onDelete: 'CASCADE'
            },
            {
                columnNames: ['stateId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'state',
                onDelete: 'CASCADE'
            }],
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('order');
    }
}
