import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CustomerMigration1580582653746 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'customer',
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
                    name: 'email',
                    type: 'varchar',
                    length: '191',
                    isUnique: true
                },
                {
                    name: 'status',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '191'
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    length: '30',
                    isNullable: true
                },
                {
                    name: 'surnames',
                    type: 'varchar',
                    length: '191',
                    isNullable: true
                },
                {
                    name: 'emailVerifiedAt',
                    type: 'timestamp',
                    isNullable: true
                },
                {
                    name: 'avatar',
                    type: 'varchar',
                    length: '191',
                    isNullable: true
                },
                {
                    name: 'documentId',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'documentNumber',
                    type: 'varchar',
                    length: '20',
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
                columnNames: ['documentId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'document',
                onDelete: 'CASCADE'
            }],
            indices: [{
                columnNames: ['email'],
                isUnique: true
            }]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('customer');
    }
}
