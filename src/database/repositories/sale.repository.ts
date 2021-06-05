import { EntityRepository, Repository } from 'typeorm';
import { ProductStockRelation } from '../entities/product_stock.entity';
import { PSSRelation } from '../entities/prod_stock_sale.entity';
import { Sale } from '../entities/sale.entity';
import { User } from '../entities/user.entity';
import events from 'events';

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {
  async sell(
    user: User,
    productUUID: string,
    stockUUID: string,
    quantity: number,
    atTimeValue: number,
  ) {
    const sale = this.create();
    const psRelation = await ProductStockRelation.findOne({
      where: { product: productUUID, stock: stockUUID },
    });
    const ProductStockSaleRelation = new PSSRelation();
    ProductStockSaleRelation.psRelation = psRelation;
    ProductStockSaleRelation.quantity = quantity;
    ProductStockSaleRelation.priceAtTime = atTimeValue;
    ProductStockSaleRelation.save();

    sale.client = user;
    sale.Quantity = quantity;
    sale.relation = sale.relation.concat(ProductStockSaleRelation);
    sale.save();
    events.prototype.emit('initSale', sale);

    return { sale, ProductStockSaleRelation };
  }
}
