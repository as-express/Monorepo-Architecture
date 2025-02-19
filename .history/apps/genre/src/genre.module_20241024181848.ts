import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://expressaset:aset@genre.dxd4n.mongodb.net/?retryWrites=true&w=majority&appName=genre')
  ],
  controllers: [GenreController],
  providers: [GenreService]
})

export class GenreModule {}
