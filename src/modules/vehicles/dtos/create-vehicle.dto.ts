import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVehicleDto {
  @IsUUID()
  @IsNotEmpty()
  project_id: string;

  @IsNotEmpty()
  @IsString()
  plate: string;

  @IsNotEmpty()
  @IsString()
  service: string;
}
