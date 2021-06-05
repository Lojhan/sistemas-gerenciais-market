import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PSSRelation } from './prod_stock_sale.entity';
import { User } from './user.entity';
import events from 'events';

@Entity()
@Unique(['uuid'])
export class Sale extends BaseEntity {
  constructor() {
    super();
    this.uuid = uuid();
    this.purchased = false;
  }

  @Column()
  purchased: boolean;

  @PrimaryColumn()
  uuid: string;

  @Column()
  Quantity: number;

  @ManyToOne((_type) => User, (user) => user.id, { eager: true })
  client: User;

  @OneToMany((_type) => PSSRelation, (relation) => relation, {
    eager: true,
  })
  relation: PSSRelation[];

  async purchase() {
    this.purchased = true;
    events.prototype.emit('purchase', this);
    this.save();
  }
}
