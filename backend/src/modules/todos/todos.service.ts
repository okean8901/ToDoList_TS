import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo } from '../../schemas/todo.schema';
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './dtos/todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
  ) {}

  async createTodo(userId: string, createTodoDto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoModel.create({
      ...createTodoDto,
      userId: new Types.ObjectId(userId),
    });

    return this.mapToResponse(todo);
  }

  async getTodosByUserId(userId: string): Promise<TodoResponseDto[]> {
    const todos = await this.todoModel.find({ userId: new Types.ObjectId(userId) });
    return todos.map(todo => this.mapToResponse(todo));
  }

  async getTodoById(todoId: string, userId: string): Promise<TodoResponseDto> {
    const todo = await this.todoModel.findOne({
      _id: new Types.ObjectId(todoId),
      userId: new Types.ObjectId(userId),
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    return this.mapToResponse(todo);
  }

  async updateTodo(todoId: string, userId: string, updateTodoDto: UpdateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(todoId),
        userId: new Types.ObjectId(userId),
      },
      updateTodoDto,
      { new: true },
    );

    if (!todo) {
      throw new Error('Todo not found');
    }

    return this.mapToResponse(todo);
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    const result = await this.todoModel.deleteOne({
      _id: new Types.ObjectId(todoId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new Error('Todo not found');
    }
  }

  private mapToResponse(todo: any): TodoResponseDto {
    return {
      id: todo._id.toString(),
      userId: todo.userId.toString(),
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }
}
