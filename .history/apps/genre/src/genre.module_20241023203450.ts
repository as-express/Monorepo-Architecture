import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot({})
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
