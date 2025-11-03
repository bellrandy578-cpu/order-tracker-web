// src/app/orders-list/orders-list.component.ts
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, ApiError } from '../order.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../models/order';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './orders-list.component.html',
})
export class OrdersListComponent {
  private orderService = inject(OrderService);
  private router = inject(Router);

  inputOrderId: number | '' = '';
  inputError: string | null = null;


  orders$: Observable<Order[]> = this.orderService.getAllOrders().pipe(
    catchError((err: ApiError) => {
      this.error = err;
      return of([]);
    })
  );

  error: ApiError | null = null;

  isValidId(): boolean {
    return typeof this.inputOrderId === 'number' && this.inputOrderId > 0;
  }

  goToOrder() {
    this.inputError = null;

    if (!this.isValidId()) {
      this.inputError = 'Please enter a valid positive number.';
      return;
    }

    this.router.navigate(['/order', this.inputOrderId]);
    this.inputOrderId = ''; 
  }

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