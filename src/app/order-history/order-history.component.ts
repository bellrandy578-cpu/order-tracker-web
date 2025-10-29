// src/app/order-history/order-history.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../order.service';
import { OrderStatusHistory } from '../models/order';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
})
export class OrderHistoryComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  history$ = this.route.paramMap.pipe(
    map(params => +params.get('id')!),
    switchMap(id => this.orderService.getOrderHistory(id))
  );
}