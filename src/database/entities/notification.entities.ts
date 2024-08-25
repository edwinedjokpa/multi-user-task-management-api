import { User } from 'src/database/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
