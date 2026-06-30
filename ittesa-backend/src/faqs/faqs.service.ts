import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './faq.entity';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async findAll(category?: string) {
    const query = this.faqRepository
      .createQueryBuilder('faq')
      .where('faq.isActive = :isActive', { isActive: true });

    if (category) {
      query.andWhere('faq.category = :category', { category });
    }

    query.orderBy('faq.order', 'ASC');

    return query.getMany();
  }

  async findOne(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return faq;
  }

  async create(data: {
    question: string;
    answer: string;
    category?: string;
    order?: number;
  }) {
    const faq = this.faqRepository.create(data);
    return this.faqRepository.save(faq);
  }

  async update(id: string, data: Partial<Faq>) {
    const faq = await this.findOne(id);
    Object.assign(faq, data);
    return this.faqRepository.save(faq);
  }

  async remove(id: string) {
    const faq = await this.findOne(id);
    await this.faqRepository.remove(faq);
    return { message: 'FAQ deleted successfully' };
  }

  async seed() {
    const count = await this.faqRepository.count();
    if (count === 0) {
      const faqs = [
        {
          question: 'Apa itu ITESSA?',
          answer:
            'ITESSA adalah IT Employee Self Service Application, portal self-service untuk karyawan IT.',
          category: 'General',
          order: 1,
        },
        {
          question: 'Bagaimana cara membuat request baru?',
          answer:
            'Anda dapat membuat request baru melalui menu View Request, pilih jenis request, dan isi formulir yang tersedia.',
          category: 'Requests',
          order: 1,
        },
        {
          question: 'Apa itu DPLK?',
          answer:
            'DPLK adalah Dana Pensiun Lembaga Keuangan, program pensiun yang dikelola oleh lembaga keuangan.',
          category: 'DPLK',
          order: 1,
        },
      ];

      for (const faq of faqs) {
        await this.create(faq);
      }
    }
  }
}