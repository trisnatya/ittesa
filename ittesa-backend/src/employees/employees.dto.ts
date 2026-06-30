import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MilestoneStatus } from './employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP001' })
  @IsString()
  @IsNotEmpty()
  nik: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'IT Directorate' })
  @IsString()
  @IsNotEmpty()
  directorate: string;

  @ApiProperty({ example: 'IT Unit' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: '+6281234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cvFilePath?: string;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'IT Directorate' })
  @IsString()
  @IsOptional()
  directorate?: string;

  @ApiPropertyOptional({ example: 'IT Unit' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: '+6281234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cvFilePath?: string;

  @ApiPropertyOptional({ enum: MilestoneStatus })
  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;
}