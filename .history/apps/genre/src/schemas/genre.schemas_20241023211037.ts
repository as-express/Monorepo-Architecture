import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Genre {
    @Prop()
    title: string

    @Prop({default: 0})
    movieCount: number

    @Prop()
    movies: string[]
}

export const 