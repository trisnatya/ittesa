import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from './request.entity';

export class CreateRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  requestTypeId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @ApiProperty({ example: 'Request Subject' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiPropertyOptional({ example: 'Request description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}

export class UpdateRequestDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ example: 'Updated Subject' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}