import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

 async create(dto: CreatePaymentDto) {
  if (dto.status === 'pending' && !dto.file_url) {
    throw new BadRequestException('Proof of payment (file_url) is required for pending status');
  }

  const paymentData = {
    ...dto,
    user_id: dto.user_id?.toString(),
  } as any;

  return await this.repo.save(paymentData);
}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const payment = await this.repo.findOneBy({ id: id.toString() });
    if (!payment) throw new NotFoundException(`Payment #${id} not found`);
    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (dto.status === 'pending' && !dto.file_url && !payment.file_url) {
      throw new BadRequestException('Proof of payment is required for pending status');
    }

    Object.assign(payment, dto);
    return await this.repo.save(payment);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    await this.repo.remove(payment);
    return { deleted: true };
  }

  async approve(id: number, fileUrl?: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'pending') {
      throw new BadRequestException('Only pending payments can be approved');
    }
    payment.status = 'completed';
    payment.payment_date = new Date();
    if (fileUrl) payment.file_url = fileUrl;
    return await this.repo.save(payment);
  }

  // Método útil: rejeitar
  async reject(id: number, reason?: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'pending') {
      throw new BadRequestException('Only pending payments can be rejected');
    }
    payment.status = 'rejected';
    return await this.repo.save(payment);
  }
}
