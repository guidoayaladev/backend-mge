export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly plate: string,
    public readonly service: string,
    public readonly createdAt: Date,
  ) {}
}
