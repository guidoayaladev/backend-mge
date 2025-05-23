import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.access_token;
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
    }
    return req;
  }
}
