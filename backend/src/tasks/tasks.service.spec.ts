import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './schemas/task.schema';

describe('TasksService', () => {
  let service: TasksService;

  const mockOwnerId = '6a4ce8bca3b5fb2689cb327c';
  const otherUserId = '6a4ce8bca3b5fb2689cb999x';
  const mockTaskId = '6a4d48c91dfb7d7b3225ecd4';

  const mockTaskDoc = {
    _id: mockTaskId,
    title: 'Test task',
    description: 'testing',
    status: TaskStatus.PENDING,
    owner: { toString: () => mockOwnerId },
    save: jest.fn().mockResolvedValue(true),
    deleteOne: jest.fn().mockResolvedValue(true),
  };

  const mockTaskModel = {
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    new: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findOne', () => {
    it('should return the task when the requesting user is the owner', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTaskDoc),
      });

      const result = await service.findOne(mockOwnerId, mockTaskId);

      expect(result).toEqual(mockTaskDoc);
    });

    it('should throw ForbiddenException when a different user tries to access the task', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTaskDoc),
      });

      await expect(service.findOne(otherUserId, mockTaskId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when the task does not exist', async () => {
      mockTaskModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(mockOwnerId, 'nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a task with the correct owner', async () => {
      const dto = { title: 'New task', description: 'details' };

      const savedTask = { ...dto, owner: mockOwnerId, save: jest.fn() };
      savedTask.save.mockResolvedValue(savedTask);

      // Mock the model constructor behavior: `new this.taskModel(...)`
      const TaskModelMock: any = jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue({ ...data }),
      }));

      const moduleWithConstructor: TestingModule = await Test.createTestingModule({
        providers: [
          TasksService,
          {
            provide: getModelToken(Task.name),
            useValue: TaskModelMock,
          },
        ],
      }).compile();

      const serviceWithConstructor = moduleWithConstructor.get<TasksService>(TasksService);
      const result = await serviceWithConstructor.create(mockOwnerId, dto);

      expect(result.owner).toBe(mockOwnerId);
      expect(result.title).toBe(dto.title);
    });
  });
});