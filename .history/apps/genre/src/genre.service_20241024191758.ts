import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './schemas/genre.schemas';
import { Model } from 'mongoose';
import { createGenre } from './dto/genre.dto';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre.name) private genre: Model<Genre>){}

  async new(dto: createGenre): Promise<Genre> {
    await this.checkGenre(dto.title)
    const genre = await this.genre.create({title: dto.title})
    await genre.save()

    return genre
  } 

  async getAll(): Promise<Genre[]> {
    return this.genre.find()
  }

  async getOne(id: string): Promise<Genre> {
    const genre = await this.genre.findById(id)
    if(genre) {throw new NotFoundException('Genre is not found')}

    return genre
  }

  async update(id: string, dto: createGenre): Promise<Genre> {
    await this.getOne(id)
    const update = await this.genre.findByIdAndUpdate(id, {title: dto.title})

    return update
  }

  async delete(id: string): Promise<void> {
    await this.genre.findByIdAndDelete(id)
  }

  async pushMovie(movie: string, id: string) {
    const genre = await this.getOne(id)

    genre.movieCount += 1
    genre.movies.push(id)
  }

  unPushMovie(id) {

  }


  private async checkGenre(title: string): Promise<void> {
    const isGenre = await this.genre.findOne({title})
    if(isGenre) {throw new BadRequestException('Genre is created already')}
  }
}
