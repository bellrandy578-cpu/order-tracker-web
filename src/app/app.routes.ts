import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

export const routes: Routes = [
  { path: 'status', component: OrderStatusComponent },
  { path: 'history', component: OrderHistoryComponent },
  { path: '', component: OrdersListComponent },
  { path: 'order/:id', component: OrderDetailComponent },
  { path: '', redirectTo: '/order/6/status', pathMatch: 'full' },
  { path: '**', redirectTo: 'order/6/status' }
];
