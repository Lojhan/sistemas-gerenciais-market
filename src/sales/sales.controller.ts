import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/database/entities/user.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // @Post()
  // @UseGuards(AuthGuard())
  // create(@Body() createSaleDto: CreateSaleDto) {
  //   return this.salesService.create(createSaleDto);
  // }

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
