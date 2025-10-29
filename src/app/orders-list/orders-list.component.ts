// src/app/orders-list/orders-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, ApiError } from '../order.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../models/order';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders-list.component.html',
})
export class OrdersListComponent {
  private orderService = inject(OrderService);

  orders$: Observable<Order[]> = this.orderService.getAllOrders().pipe(
    catchError((err: ApiError) => {
      this.error = err;
      return of([]);
    })
  );

  error: ApiError | null = null;

  retry() {
    this.error = null;
    this.orders$ = this.orderService.getAllOrders().pipe(
      catchError((err: ApiError) => {
        this.error = err;
        return of([]);
      })
    );
  }
}