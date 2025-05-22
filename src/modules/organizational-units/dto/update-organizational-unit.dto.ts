import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateOrganizationalUnitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsUUID()
  @IsOptional()
  project_id?: string;
}
