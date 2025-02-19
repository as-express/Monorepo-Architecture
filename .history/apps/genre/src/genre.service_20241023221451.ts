import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './schemas/genre.schemas';
import { Model } from 'mongoose';
import { createGenre } from './dto/genre.dto';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre.name) private genre: Model<Genre>){}

  async new(dto: createGenre) {
    await this.checkGenre(dto.title)
    const genre = await this.genre.create({title: dto.title})
    await genre.save()

    return genre
  } 

  async getAll() {
    return this.genre.find()
  }

  async getOne(id: string) {
    const genre = await this.genre.findById(id)
    if(genre) {throw new NotFoundException('Genre is not found')}

    return genre
  }

  async update(id: string, dto: createGenre) {
    await this.getOne()
  }


  private async checkGenre(title: string): Promise<void> {
    const isGenre = await this.genre.findOne({title})
    if(isGenre) {throw new BadRequestException('Genre is created already')}
  }
}
