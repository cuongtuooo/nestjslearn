import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://cuongtuooo:cuonganh241..@cluster0.uwn3e.mongodb.net/')
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService]
    }),
    UsersModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
