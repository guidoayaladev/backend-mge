export class Transfer {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly createdAt: Date,
    public readonly vehicleId: string,
    public readonly clientId: string,
    public readonly transmitterId: string,
    public readonly projectId: string,
    public readonly organizationalUnitId: string,
  ) {}
}
