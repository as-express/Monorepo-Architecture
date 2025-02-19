import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './schemas/genre.schemas';
import { Model } from 'mongoose';
import { createGenre } from './dto/genre.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private genre: Model<Genre>,
    private http: HttpService,
  ) {}

  async new(dto: createGenre): Promise<Genre> {
    await this.checkGenre(dto.title);
    const genre = await this.genre.create({ title: dto.title });
    await genre.save();

    return genre;
  }

  async getAll(): Promise<Genre[]> {
    return this.genre.find();
  }

  async getOne(id: string): Promise<Genre> {
    const genre = await this.genre.findById(id).populate('movies');
    if (genre) {
      throw new NotFoundException('Genre is not found');
    }

    return genre;
  }

  async update(id: string, dto: createGenre): Promise<Genre> {
    await this.getOne(id);
    const update = await this.genre.findByIdAndUpdate(id, { title: dto.title });

    return update;
  }

  async delete(id: string): Promise<void> {
    await this.genre.findByIdAndDelete(id);
  }

  async updateMovies(genreId: string, movieId: string) {
    return this.genre.findByIdAndUpdate(genreId, {
      $push: { movies: movieId },
    });
  }

  async removeMovie(genreId: string, movieId: string) {
    return this.genre.findByIdAndUpdate(genreId, {
      $pull: { movies: movieId },
    });
  }

  private async checkGenre(title: string): Promise<void> {
    const isGenre = await this.genre.findOne({ title });
    if (isGenre) {
      throw new BadRequestException('Genre is created already');
    }
  }

  private async getGenreId(title: string): Promise<Genre> {
    const genre = await this.genre.findOne({ title });
    if (!genre) {
      throw new NotFoundException('Genre is not defined');
    }

    return genre;
  }
}
