import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/shared/types/authenticated-user.interface';
import { User } from 'src/shared/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(dto);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.STAGE === 'prod',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 6, // 6 horas
    });

    return { message: 'Autenticación exitosa' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@User() user: AuthenticatedUser) {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      projectIds: user.projectIds,
      unitIds: user.unitIds,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Sesión cerrada correctamente' };
  }
}
