import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    const projectId = body.projectId || request.params.projectId;

    if (!user?.projectIds?.includes(projectId)) {
      throw new ForbiddenException(`No tienes acceso al proyecto ${projectId}`);
    }

    return true;
  }
}
