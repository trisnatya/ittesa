import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async findAll(requestTypeId?: string) {
    const query = this.templateRepository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.requestType', 'requestType');

    if (requestTypeId) {
      query.andWhere('template.requestTypeId = :requestTypeId', {
        requestTypeId,
      });
    }

    query.orderBy('template.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string) {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['requestType'],
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async create(data: {
    requestTypeId: string;
    name: string;
    filePath: string;
    description?: string;
  }) {
    const template = this.templateRepository.create(data);
    return this.templateRepository.save(template);
  }

  async update(id: string, data: Partial<Template>) {
    const template = await this.findOne(id);
    Object.assign(template, data);
    return this.templateRepository.save(template);
  }

  async remove(id: string) {
    const template = await this.findOne(id);
    await this.templateRepository.remove(template);
    return { message: 'Template deleted successfully' };
  }
}