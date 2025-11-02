// src/app/order-detail/order-detail.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, ApiError } from '../order.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, catchError, startWith, map } from 'rxjs/operators';
import { Order, OrderStatusHistory } from '../models/order';

interface DetailState {
  order?: Order;
  history?: OrderStatusHistory[];
  orderError?: ApiError;
  historyError?: ApiError;
  loading: boolean;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Per spec the direction was to use TWO calls to server to get order and its history.
  // detail$ = this.refresh$.pipe(
  //   switchMap(() => this.route.paramMap),
  //   switchMap(params => {
  //     const id = +params.get('id')!;
  //     return this.orderService.getOrderWithHistory(id).pipe(
  //       map(({ order, history }) => ({
  //         order,
  //         history,
  //         loading: false,
  //       } as DetailState)),
  //       catchError(err => {
  //         if (err.isOrderError) {
  //           return of({
  //             orderError: err,
  //             loading: false,
  //           } as DetailState);
  //         }
  //         if (err.isHistoryError) {
  //           return of({
  //             order: err.order,
  //             historyError: err,
  //             loading: false,
  //           } as DetailState);
  //         }
  //         return of({
  //           orderError: err,
  //           loading: false,
  //         } as DetailState);
  //       }),
  //       startWith({ loading: true } as DetailState)
  //     );
  //   })
  // );

  detail$ = this.refresh$.pipe(
    switchMap(() => this.route.paramMap),
    switchMap(params => {
      const id = +params.get('id')!;
      return this.orderService.getOrderWithHistory(id).pipe(
        map((order: Order) => ({
          order,
          history: order.history,
          loading: false,
        } as DetailState)),
        catchError(err => {
          if (err.isOrderError) {
            return of({
              orderError: err,
              loading: false,
            } as DetailState);
          }
          if (err.isHistoryError) {
            return of({
              order: err.order,
              historyError: err,
              loading: false,
            } as DetailState);
          }
          return of({
            orderError: err,
            loading: false,
          } as DetailState);
        }),
        startWith({ loading: true } as DetailState)
      );
    })
  );

  retry() {
    this.refresh$.next();
  }
}