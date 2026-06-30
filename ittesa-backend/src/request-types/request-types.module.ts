import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestType } from './request-type.entity';
import { RequestTypesService } from './request-types.service';
import { RequestTypesController } from './request-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RequestType])],
  controllers: [RequestTypesController],
  providers: [RequestTypesService],
  exports: [RequestTypesService],
})
export class RequestTypesModule {}