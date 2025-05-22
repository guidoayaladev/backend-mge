import { IsUUID, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateTransferDto {
  @IsUUID()
  @IsOptional()
  vehicle_id?: string;

  @IsUUID()
  @IsOptional()
  client_id?: string;

  @IsUUID()
  @IsOptional()
  transmitter_id?: string;

  @IsUUID()
  @IsOptional()
  project_id?: string;

  @IsUUID()
  @IsOptional()
  organizational_unit_id?: string;

  @IsString()
  @IsOptional()
  @IsIn(['venta', 'cesion', 'donacion'], {
    message: 'El tipo debe ser venta, cesion o donacion',
  })
  type?: string;
}
