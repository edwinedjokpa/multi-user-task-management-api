import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { Task } from 'src/database/entities/task.entity';
import { User } from 'src/database/entities/user.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createComment(
    user: User,
    taskId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['comments'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found.`);
    }

    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    // Create and save the comment
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      author: foundUser,
      task: task,
    });

    task.comments = [...(task.comments || []), comment];

    await this.taskRepository.save(task);
    const newComment = await this.commentRepository.save(comment);

    return newComment;
  }

  async updateComment(
    user: User,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const commentExists = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: ['author'],
    });

    if (!commentExists) {
      throw new NotFoundException(`Comment with ID ${commentId} not found.`);
    }

    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    if (commentExists.author.id !== foundUser.id) {
      throw new UnauthorizedException('You can only update your own comments.');
    }

    commentExists.content = updateCommentDto.content;

    return await this.commentRepository.save(commentExists);
  }

  async deleteComment(user: User, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'task'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found.`);
    }

    // Check if the user exists
    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    // Verify if the comment's author matches the current user
    if (comment.author.id !== foundUser.id) {
      throw new UnauthorizedException('You can only delete your own comments.');
    }

    // Ensure the task and its comments are valid
    const task = comment.task;

    if (task) {
      if (!task.comments) {
        task.comments = [];
      }
      // Remove the comment from the task's comments list
      task.comments = task.comments.filter((c) => c.id !== comment.id);

      // Save the updated task
      await this.taskRepository.save(task);
    }

    // Remove the comment
    await this.commentRepository.remove(comment);
  }
}
