import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PaymentTypeMigration1580582653741 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'payment_type',
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
                }
            ]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('payment_type');
    }
}
