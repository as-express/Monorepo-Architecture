import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '../../.env'}),
    MongooseModule.forRoot(process.env.movie_database)
  ],
  controllers: [MovieController],
  providers: [MovieService, ConfigService],
})

export class MovieModule {}
