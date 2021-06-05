/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './database/config/typeorm.config';
import { MessagesModule } from './messages/messages.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    MessagesModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(
      'mongodb+srv://root:1234@cluster0.szknf.mongodb.net/Cluster0?retryWrites=true"',
      {
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      },
    ),
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
