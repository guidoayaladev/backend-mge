import { AuthenticatedUser } from './authenticated-user.interface';

declare module 'express' {
  export interface Request {
    user?: AuthenticatedUser;
  }
}
