import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOrganizationalUnitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  project_id: string;
}
