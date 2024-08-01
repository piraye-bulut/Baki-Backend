import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({message:'Ad alanı boş bırakılamaz.'})
  @IsString()
  @MinLength(2,{message: 'Ad alanı en az 2 harften oluşmalıdır.'})
  firstName: string;

  @IsNotEmpty({message:'Soyad alanı boş bırakılamaz.'})
  @IsString()
  @MinLength(2,{message: 'Soyad alanı en az 2 harften oluşmalıdır.'})
  lastName: string;
  
  @IsEmail()
  @IsNotEmpty({message:'Email alanı boş bırakılamaz.'})
  email: string;

  @IsString()
  @IsNotEmpty({message:'Şifre alanı boş bırakılamaz.'})
  @MinLength(5,{message: 'Şifre en az 5 karakterden oluşmalıdır.'})
  @Matches(/(?=.*[a-z])/,{message:'Şifre en az bir küçük harf içermelidir.'})
  @Matches(/(?=.*[A-Z])/, {message:'Şifre en az bir büyük harf içermelidir.'})
  @Matches(/(?=.*[0-9])/, {message:'Şifre en az bir rakam içermelidir.'})
  @Matches(/(?=.*[#?!@$%^&*-])/, {message:'Şifre en az bir özel karakter içermelidir.'})

  password: string;
}