import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  poemType: string;

  @IsNotEmpty()
  @IsNumber()
  poemId: number;

 @IsNotEmpty()
  @IsString()
  user: string;  

@IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  date: string;
}