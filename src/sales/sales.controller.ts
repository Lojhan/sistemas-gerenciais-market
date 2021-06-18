import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/database/entities/user.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() body: CreateSaleDto[], @GetUser() user: User) {
    try {
      return await this.salesService.create(user, body);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@GetUser() user: User) {
    return this.salesService.findAll(user);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.salesService.findOne(uuid);
  }

  @Put('confirm-payment')
  pay(@Body() paymentTicket: any) {
    this.salesService.conclude(paymentTicket);
  }

  @Put('send-ticket')
  insertTicket(@Body() paymentTicket: any) {
    console.log(paymentTicket);
    this.salesService.insertTicket(paymentTicket);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  remove(@Param('uuid') uuid: string, @GetUser() user: User) {
    return this.salesService.remove(uuid, user);
  }
}
