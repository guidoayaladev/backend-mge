export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
  projectIds: string[];
  unitIds: string[];
}
