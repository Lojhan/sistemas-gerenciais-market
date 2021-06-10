import { ProductStockRelation } from 'src/database/entities/product_stock.entity';

export class CreateSaleDto {
  product: ProductStockRelation;
  quantity: number;
}
