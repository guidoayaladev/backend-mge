import { IsUUID, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  @IsNotEmpty()
  vehicle_id: string;

  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @IsUUID()
  @IsNotEmpty()
  transmitter_id: string;

  @IsUUID()
  @IsNotEmpty()
  project_id: string;

  @IsUUID()
  @IsNotEmpty()
  organizational_unit_id: string;

  @IsString()
  @IsIn(['venta', 'cesion', 'donacion'])
  type: string;
}
