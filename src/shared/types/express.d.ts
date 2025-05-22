import { UserSessionPayload } from './user-session.interface';

declare module 'express' {
  export interface Request {
    user?: UserSessionPayload;
  }
}
