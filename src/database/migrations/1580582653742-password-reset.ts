import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PasswordResetMigration1580582653742 implements MigrationInterface {

    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(new Table({
            name: 'password_reset',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '191'
                },
                {
                    name: 'token',
                    type: 'varchar',
                    length: '191'
                },
                {
                    name: 'expireAt',
                    type: 'timestamp'
                }
            ],
            indices: [{
                columnNames: ['email']
            }]
        }), true);

    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable('password_reset');
    }
}
