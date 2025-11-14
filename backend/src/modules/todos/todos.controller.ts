import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './dtos/todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    return this.todosService.createTodo(req.user.userId, createTodoDto);
  }

  @Get()
  async getTodos(@Req() req: any): Promise<TodoResponseDto[]> {
    return this.todosService.getTodosByUserId(req.user.userId);
  }

  @Get(':id')
  async getTodo(@Param('id') id: string, @Req() req: any): Promise<TodoResponseDto> {
    return this.todosService.getTodoById(id, req.user.userId);
  }

  @Put(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: any,
  ): Promise<TodoResponseDto> {
    return this.todosService.updateTodo(id, req.user.userId, updateTodoDto);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @Req() req: any): Promise<void> {
    return this.todosService.deleteTodo(id, req.user.userId);
  }
}
