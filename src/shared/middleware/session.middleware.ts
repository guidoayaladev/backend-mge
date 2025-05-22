import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.sub },
      relations: ['roles', 'projects', 'organizationalUnits'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      projectIds: user.projects.map((p) => p.id),
      unitIds: user.organizationalUnits.map((u) => u.id),
      permissions: user.roles.flatMap(
        (r) => r.permissions?.map((p) => p.name) || [],
      ),
    };

    next();
  }
}
