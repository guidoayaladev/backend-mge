import { SetMetadata } from '@nestjs/common';

/**
 * Permite definir los permisos necesarios para un controlador o handler.
 * Uso: @Permissions('view_transfers', 'manage_users')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
