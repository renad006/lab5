import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './models/todos.schema';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  getAll() {
    return this.todoModel.find().exec();
  }

  getOne(id: string) {
    return this.todoModel.findById(id).exec();
  }

  getAllForOwner(ownerId: string) {
    return this.todoModel.find({ owner: ownerId }).exec();
  }

  getOneForOwner(id: string, ownerId: string) {
    return this.todoModel.findOne({ _id: id, owner: ownerId }).exec();
  }

  create(todo: Partial<Todo>) {
    return this.todoModel.create(todo);
  }

  update(id: string, updatedTodo: Partial<Todo>) {
    return this.todoModel
      .findByIdAndUpdate(id, updatedTodo, { new: true, runValidators: true })
      .exec();
  }

  updateForOwner(id: string, updatedTodo: Partial<Todo>, ownerId: string) {
    return this.todoModel
      .findOneAndUpdate(
        { _id: id, owner: ownerId },
        updatedTodo,
        { new: true, runValidators: true },
      )
      .exec();
  }

  async delete(id: string) {
    const todo = await this.todoModel.findByIdAndDelete(id).exec();
    return { message: todo ? 'Todo deleted' : 'Todo not found' };
  }

  async deleteForOwner(id: string, ownerId: string) {
    const todo = await this.todoModel.findOneAndDelete({ _id: id, owner: ownerId }).exec();
    return todo ? { message: 'Todo deleted' } : null;
  }
}
