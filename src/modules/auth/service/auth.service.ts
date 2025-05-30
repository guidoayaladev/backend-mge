import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: [
        'roles',
        'roles.permissions',
        'projects',
        'organizationalUnits',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      projectIds: user.projects.map((p) => p.id),
      unitIds: user.organizationalUnits.map((u) => u.id),
    };

    return {
      message: 'Autenticación exitosa',
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  @Cron('* * * * *')
  async keepAlive() {
    try {
      await fetch('https://backend-mge.onrender.com/ping');
      this.logger.log('✅ Ping interno enviado');
    } catch (err) {
      this.logger.error('❌ Error en ping interno', err);
    }
  }
}
