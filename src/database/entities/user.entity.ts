import { Comment } from './comment.entity';
import { Notification } from 'src/database/entities/notification.entities';
import { Task } from 'src/database/entities/task.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.creator)
  created_tasks: Task[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];
}
