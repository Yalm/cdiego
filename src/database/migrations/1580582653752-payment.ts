import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PaymentMigration1580582653752 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'payment',
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
                    name: 'amount',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    default: 0
                },
                {
                    name: 'referenceCode',
                    type: 'varchar',
                    length: '191',
                    isNullable: true
                },
                {
                    name: 'paymentTypeId',
                    type: 'int'
                }
            ],
            foreignKeys: [{
                columnNames: ['paymentTypeId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'payment_type',
                onDelete: 'CASCADE'
            },
            {
                columnNames: ['orderId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'order',
                onDelete: 'CASCADE'
            }]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('payment');
    }
}
