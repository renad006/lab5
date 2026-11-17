import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true, default: 'Untitled' })
  title: string;

  @Prop({ default: false })
  done: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account', required: true })
  owner: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
