import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleRepository } from 'src/database/repositories/sale.repository';
import { User } from '../database/entities/user.entity';
import { PSSRepositoty } from 'src/database/repositories/pss.repository';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SaleRepository)
    private saleRepository: SaleRepository,
    @InjectRepository(PSSRepositoty)
    private pssRepositoty: PSSRepositoty,
  ) {}

  async create(user: User, sales: CreateSaleDto[]) {
    const result = await this.saleRepository.sell(user, sales);
    return result;
  }

  async insertTicket(paymentTicket: any) {
    const sale = await this.saleRepository.findOne({
      where: { uuid: paymentTicket.saleId },
    });

    sale.paymentTicket = paymentTicket.uuid;
    return await sale.save();
  }

  async findAll(client: User) {
    const sales = await this.saleRepository.find({
      where: { client },
    });
    return sales;
  }

  async findOne(uuid: string) {
    const sale = await this.saleRepository.findOne({ where: { uuid } });
    sale.relation = await this.pssRepositoty.find({ where: { sale } });
    return sale;
  }

  async remove(uuid: string, user: User) {
    const sale = await this.saleRepository.findOne({ where: { uuid } });
    if (sale.client === user) {
      return await sale.remove();
    } else {
      throw new UnauthorizedException();
    }
  }

  async conclude(paymentData: any) {
    if (paymentData.ticket) {
      const paymentTicket = paymentData.ticket;

      try {
        const sale = await this.saleRepository.findOne({
          where: { paymentTicket },
        });
        await sale.purchase();
        return sale;
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        console.log('test');
        const sale = await this.saleRepository.findOne({
          where: { uuid: paymentData.saleID },
        });
        await sale.purchase();
        return sale;
      } catch (e) {
        console.log(e);
      }
    }
  }
}
