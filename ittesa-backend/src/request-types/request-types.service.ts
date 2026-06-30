import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestType } from './request-type.entity';

@Injectable()
export class RequestTypesService {
  constructor(
    @InjectRepository(RequestType)
    private requestTypeRepository: Repository<RequestType>,
  ) {}

  async findAll() {
    return this.requestTypeRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    return this.requestTypeRepository.findOne({ where: { id } });
  }

  async create(data: Partial<RequestType>) {
    const requestType = this.requestTypeRepository.create(data);
    return this.requestTypeRepository.save(requestType);
  }

  async update(id: string, data: Partial<RequestType>) {
    await this.requestTypeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.requestTypeRepository.delete(id);
    return { message: 'Request type deleted successfully' };
  }

  async seed() {
    const count = await this.requestTypeRepository.count();
    if (count === 0) {
      const types = [
        { name: 'DPLK', description: 'Dana Pensiun Lembaga Keuangan' },
        { name: 'Housing', description: 'Kebutuhan Perumahan' },
        { name: 'Administration Later', description: 'Administrasi Tunda' },
        { name: 'HC Communication', description: 'Komunikasi HC' },
      ];
      for (const type of types) {
        await this.create(type);
      }
    }
  }
}