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
import { Cron, CronExpression } from '@nestjs/schedule';

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
      access_token: this.jwtService.sign(payload),
    };
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async keepAlive() {
    try {
      const count = await this.userRepository.count();
      this.logger.log(`👥 Usuarios registrados: ${count}`);
    } catch (error) {
      this.logger.error('❌ Error en keepalive cron', error);
    }
  }
}
