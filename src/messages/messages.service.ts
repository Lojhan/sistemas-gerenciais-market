import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as amqp from 'amqplib/callback_api';
import * as events from 'events';
import { Sale } from 'src/database/entities/sale.entity';

@Injectable()
export class MessagesService {
  private channel: amqp.Channel;
  constructor() {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) throw error0;
      connection.createChannel((error1, channel) => {
        if (error1) throw error1;
        this.channel = channel;
        this.channel.assertQueue('sales');
        this.channel.assertQueue('purchases');
        console.log('teste');
      });
    });

    events.prototype.on('purchase', (sale) => this.sendPurchaseMessage(sale));
    events.prototype.on('initSale', (sale) =>
      this.sendInitPurchaseMessage(sale),
    );

    // setInterval(
    //   () =>
    //     this.channel.get('hello', {}, (_err, data) => {
    //       console.log(data);
    //     }),
    //   50000,
    // );
  }

  sendPurchaseMessage(sale: Sale) {
    console.log(sale);
    this.channel.sendToQueue('sales', Buffer.from(JSON.stringify(sale)));
  }

  sendInitPurchaseMessage(sale: Sale) {
    this.channel.sendToQueue('purchases', Buffer.from(JSON.stringify(sale)));
  }
}
