// src/app/models/order.ts
export interface OrderStatusHistory {
  id: number;
  orderId: number;           // matches Order.id
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  changedAt: string;         // ISO date string (e.g., "2025-09-24")
  changedBy?: string;        // optional
}

export interface Order {
  id: number;
  product: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;              // order creation date
  amount: number;
  /** Embedded history – same orderId as this.id */
  history: OrderStatusHistory[];
}