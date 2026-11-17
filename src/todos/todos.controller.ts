import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Todo } from './models/todos.schema';
import { TodosService } from './todos.service';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  async getAll(@Req() req: any) {
    if (!req.user) {
      return this.todosService.getAll();
    }

    if (req.user.role === 'admin') {
      return this.todosService.getAll();
    }

    return this.todosService.getAllForOwner(req.user.id || req.user.sub);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  async getOne(@Param('id') id: string, @Req() req: any) {
    if (!req.user) {
      return this.todosService.getOne(id);
    }

    if (req.user.role === 'admin') {
      return this.todosService.getOne(id);
    }

    const todo = await this.todosService.getOneForOwner(id, req.user.id || req.user.sub);
    if (!todo) {
      throw new ForbiddenException('Forbidden');
    }

    return todo;
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  create(@Body() todo: Partial<Todo>, @Req() req: any) {
    const owner = req.user?.id || req.user?.sub;
    return this.todosService.create({
      ...todo,
      owner,
    });
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  async update(@Param('id') id: string, @Body() todo: Partial<Todo>, @Req() req: any) {
    if (!req.user) {
      return this.todosService.update(id, todo);
    }

    if (req.user.role === 'admin') {
      return this.todosService.update(id, todo);
    }

    const updatedTodo = await this.todosService.updateForOwner(
      id,
      {
        ...todo,
        owner: req.user.id || req.user.sub,
      },
      req.user.id || req.user.sub,
    );

    if (!updatedTodo) {
      throw new ForbiddenException('Forbidden');
    }

    return updatedTodo;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'user')
  async delete(@Param('id') id: string, @Req() req: any) {
    if (!req.user) {
      return this.todosService.delete(id);
    }

    if (req.user.role === 'admin') {
      return this.todosService.delete(id);
    }

    const result = await this.todosService.deleteForOwner(
      id,
      req.user.id || req.user.sub,
    );

    if (!result) {
      throw new ForbiddenException('Forbidden');
    }

    return result;
  }
}
