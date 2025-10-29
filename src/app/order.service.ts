// src/app/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Order, OrderStatusHistory } from './models/order';

const API_BASE = 'http://localhost:5253/api';

export interface ApiError {
  message: string;
  retry?: () => void;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  /** GET /orders – list all orders */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE}/orders`).pipe(
      catchError(this.handleError<Order[]>('getAllOrders', []))
    );
  }

  /** GET /orders/{id} */
  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${API_BASE}/orders/${orderId}`).pipe(
      catchError(this.handleError<Order>(`getOrder(${orderId})`))
    );
  }

  /** GET /orders/{id}/history */
  getOrderHistory(orderId: number): Observable<OrderStatusHistory[]> {
    return this.http.get<OrderStatusHistory[]>(`${API_BASE}/orders/${orderId}/history`).pipe(
      catchError(this.handleError<OrderStatusHistory[]>(`getOrderHistory(${orderId})`, []))
    );
  }

  /** Sequential: order → history */
  getOrderWithHistory(orderId: number): Observable<{ order: Order; history: OrderStatusHistory[] }> {
    return this.getOrder(orderId).pipe(
      catchError(err => {
        throw { ...err, isOrderError: true };
      }),
      switchMap(order =>
        this.getOrderHistory(orderId).pipe(
          map(history => ({ order, history })),
          catchError(err => {
            throw { ...err, isHistoryError: true, order };
          })
        )
      )
    );
  }

  // Generic error handler
  private handleError<T>(operation: string, fallback?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      const message =
        error.status === 0
          ? `Network error: Please check your connection.`
          : error.status === 404
          ? `${operation}: Not found.`
          : `${operation}: ${error.status} - ${error.message}`;

      console.error(message, error);
      const apiError: ApiError = { message };
      if (fallback !== undefined) {
        return of(fallback);
      }
      return throwError(() => apiError);
    };
  }
}