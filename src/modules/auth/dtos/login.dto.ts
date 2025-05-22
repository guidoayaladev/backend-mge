import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  email: string;

  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial',
    },
  )
  password: string;
}
