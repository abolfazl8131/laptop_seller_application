import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SellComponent } from '../list/sell.component';
import { SellDetailComponent } from '../detail/sell-detail.component';
import { SellRoutingResolveService } from './sell-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sellRoute: Routes = [
  {
    path: '',
    component: SellComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SellDetailComponent,
    resolve: {
      sell: SellRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sellRoute)],
  exports: [RouterModule],
})
export class SellRoutingModule {}