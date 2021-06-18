import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SaleRepository } from 'src/database/repositories/sale.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PSSRepositoty } from 'src/database/repositories/pss.repository';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [
    TypeOrmModule.forFeature([SaleRepository, PSSRepositoty]),
    AuthModule,
  ],
})
export class SalesModule {}
