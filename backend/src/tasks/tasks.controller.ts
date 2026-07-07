import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    Req,
    Query,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { TasksService } from './tasks.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
  
  interface AuthenticatedRequest extends Request {
    user: { userId: string; email: string; name: string };
  }
  
  @Controller('tasks')
  @UseGuards(JwtAuthGuard)
  export class TasksController {
    constructor(private tasksService: TasksService) {}
  
    @Post()
    create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
      return this.tasksService.create(req.user.userId, dto);
    }
  
    @Get()
    findAll(@Req() req: AuthenticatedRequest, @Query() query: QueryTaskDto) {
      return this.tasksService.findAllForUser(req.user.userId, query);
    }    
  
    @Get(':id')
    findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
      return this.tasksService.findOne(req.user.userId, id);
    }
  
    @Put(':id')
    update(
      @Req() req: AuthenticatedRequest,
      @Param('id') id: string,
      @Body() dto: UpdateTaskDto,
    ) {
      return this.tasksService.update(req.user.userId, id, dto);
    }
  
    @Delete(':id')
    remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
      return this.tasksService.remove(req.user.userId, id);
    }
  }