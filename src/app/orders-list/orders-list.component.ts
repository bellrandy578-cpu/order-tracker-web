// src/app/orders-list/orders-list.component.ts
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService, ApiError } from '../order.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
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


  // RETRY TRIGGER
  private refresh$ = new BehaviorSubject<void>(undefined);

  // With BehaviorSubject we now have a better way 
  // to trigger refreshes and start with state
  orders$ : Observable<Order[]> = this.refresh$.pipe(
    switchMap(() => this.orderService.getAllOrders()),
    catchError((err: ApiError) => {
      this.error = err;
      return of([]); // fallback
    }),
    startWith([]) // empty array while loading
  );

  // Old code did not use a BehaviorSubject as arefreash trigger
  // orders$: Observable<Order[]> = this.orderService.getAllOrders().pipe(
  //   catchError((err: ApiError) => {
  //     this.error = err;
  //     return of([]);
  //   })
  // );

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
    this.refresh$.next();
    // Old code was recreating the observable from the service directly
    //  - refresh$.next() replaces this
    // this.orders$ = this.orderService.getAllOrders().pipe(
    //   catchError((err: ApiError) => {
    //     this.error = err;
    //     return of([]);
    //   })
    // );
  }
}