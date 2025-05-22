export class OrganizationalUnit {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly projectId: string,
    public readonly createdAt: Date,
    public readonly userIds: string[] = [],
  ) {}
}
