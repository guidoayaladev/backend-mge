export interface UserSessionPayload {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  projectIds: string[];
  unitIds: string[];
}
