import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  InternalServerErrorException,
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
      let payload = [];

      payload = body.map(
        ({ product: { product, stock, inStockValue }, quantity }) =>
          () =>
            new Promise(async (resolve, reject) => {
              try {
                const result = await this.salesService.create(
                  user,
                  product.uuid,
                  stock.uuid,
                  quantity,
                  inStockValue,
                );
                resolve(result);
              } catch (e) {
                reject(e);
              }
            }),
      );

      return await Promise.all(payload.map((func) => func()));
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
  @UseGuards(AuthGuard())
  findOne(@Param('uuid') uuid: string) {
    return this.salesService.findOne(uuid);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard())
  remove(@Param('uuid') uuid: string, @GetUser() user: User) {
    return this.salesService.remove(uuid, user);
  }
}
