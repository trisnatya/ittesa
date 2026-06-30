import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(
    @Body()
    data: {
      email: string;
      password: string;
      fullName: string;
      roleId?: string;
    },
  ) {
    return this.usersService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { fullName?: string; password?: string; isActive?: boolean },
    @Request() req,
  ) {
    return this.usersService.update(id, data, req.user.id);
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('roleId') roleId: string,
    @Request() req,
  ) {
    return this.usersService.updateRole(id, roleId, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user.id);
  }
}