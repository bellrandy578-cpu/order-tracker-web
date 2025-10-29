// src/app/order-status/order-status.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-status.component.html',
})
export class OrderStatusComponent {
  private orderService = inject(OrderService);
  orderId = 6;                     // <-- replace with route param / input as needed
  order$!: Observable<Order>;

  constructor() {
    this.refresh();
  }

  refresh() {
    this.order$ = this.orderService.getOrder(this.orderId);
  }

  // Example update – you can add PUT later
  markShipped() {
    // this.orderService.updateStatus(this.orderId, 'shipped')...
    this.refresh();
  }
}