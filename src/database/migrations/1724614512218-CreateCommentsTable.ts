import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCommentsTable1724614512218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'authorId',
            type: 'uuid',
          },
          {
            name: 'taskId',
            type: 'uuid',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tasks',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('comments');
    const authorForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('authorId') !== -1,
    );
    const taskForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('taskId') !== -1,
    );
    if (authorForeignKey) {
      await queryRunner.dropForeignKey('comments', authorForeignKey);
    }
    if (taskForeignKey) {
      await queryRunner.dropForeignKey('comments', taskForeignKey);
    }

    // Drop the comments table
    await queryRunner.dropTable('comments');
  }
}
