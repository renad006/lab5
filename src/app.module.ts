import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    AccountModule,
    TodosModule,
    MongooseModule.forRoot('mongodb://localhost:27017/todos'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
