import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  async create(
    @Body() data: { name: string; permissions?: Record<string, any> },
  ) {
    return this.rolesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; permissions?: Record<string, any> },
  ) {
    return this.rolesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}