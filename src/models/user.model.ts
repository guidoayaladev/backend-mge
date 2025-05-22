export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
    public readonly projectIds: string[] = [],
    public readonly organizationalUnitIds: string[] = [],
    public readonly roleNames: string[] = [],
  ) {}
}
