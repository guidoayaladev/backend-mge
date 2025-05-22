import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateVehicleDto {
  @IsUUID()
  @IsOptional()
  project_id?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  service?: string;
}
