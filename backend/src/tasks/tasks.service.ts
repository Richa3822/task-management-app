import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel({ ...dto, owner: userId });
    return task.save();
  }

  async findAllForUser(userId: string, query: QueryTaskDto) {
    const { status, page = 1, limit = 10 } = query;
  
    const filter: Record<string, unknown> = { owner: userId };
    if (status) {
      filter.status = status;
    }
  
    const skip = (page - 1) * limit;
  
    const [tasks, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);
  
    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }  

  async findOne(userId: string, taskId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.assertOwnership(task, userId);
    return task;
  }

  async update(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.findOne(userId, taskId);

    Object.assign(task, dto);
    return task.save();
  }

  async remove(userId: string, taskId: string): Promise<void> {
    const task = await this.findOne(userId, taskId);
    await task.deleteOne();
  }

  private assertOwnership(task: TaskDocument, userId: string): void {
    if (task.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}