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
import { RequestTypesService } from './request-types.service';

@ApiTags('Request Types')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('request-types')
export class RequestTypesController {
  constructor(private requestTypesService: RequestTypesService) {}

  @Get()
  async findAll() {
    return this.requestTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requestTypesService.findOne(id);
  }

  @Post()
  async create(@Body() data: { name: string; description?: string }) {
    return this.requestTypesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string },
  ) {
    return this.requestTypesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.requestTypesService.remove(id);
  }
}