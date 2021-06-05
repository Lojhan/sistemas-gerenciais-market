import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/database/entities/sale.entity';
import { SaleRepository } from 'src/database/repositories/sale.repository';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { User } from '../database/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SaleRepository)
    private saleRepository: SaleRepository,
  ) {}

  async create(
    user: User,
    productUUID: string,
    stockUUID: string,
    quantity: number,
    atTimeValue: number,
  ) {
    const result = await this.saleRepository.sell(
      user,
      productUUID,
      stockUUID,
      quantity,
      atTimeValue,
    );
    return result;
  }

  async findAll(client: User) {
    return await this.saleRepository.find({ where: { client } });
  }

  async findOne(uuid: string) {
    return await this.saleRepository.findOne({ where: { uuid } });
  }

  async remove(uuid: string, user: User) {
    const sale = await this.saleRepository.findOne({ where: { uuid } });
    if (sale.client === user) {
      return await sale.remove();
    } else {
      throw new UnauthorizedException();
    }
  }

  async conclude(uuid: string, user: User) {
    const sale = await this.saleRepository.findOne({ where: { uuid } });
    if (sale.client === user) {
      await sale.purchase();
      return sale;
    } else {
      throw new UnauthorizedException();
    }
  }
}
