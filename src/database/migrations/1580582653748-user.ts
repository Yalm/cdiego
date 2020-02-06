import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserMigration1580582653748 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'user',
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
                    name: 'surnames',
                    type: 'varchar',
                    length: '191',
                    isNullable: true
                },
                {
                    name: 'avatar',
                    type: 'varchar',
                    length: '191',
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
            indices: [{
                columnNames: ['email'],
                isUnique: true
            }]
        }), true, true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('user');
    }
}
