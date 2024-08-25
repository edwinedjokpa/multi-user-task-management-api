import { Comment } from 'src/database/entities/comment.entity';
import { User } from 'src/database/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  TO_DO = 'To-Do',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column({ default: TaskStatus.TO_DO })
  status: TaskStatus;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.created_tasks)
  creator: User;

  @ManyToOne(() => User, (user) => user.tasks)
  assignedTo: User;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
