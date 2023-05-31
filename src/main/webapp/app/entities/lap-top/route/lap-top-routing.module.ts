import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LapTopComponent } from '../list/lap-top.component';
import { LapTopDetailComponent } from '../detail/lap-top-detail.component';
import { LapTopUpdateComponent } from '../update/lap-top-update.component';
import { LapTopRoutingResolveService } from './lap-top-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const lapTopRoute: Routes = [
  {
    path: '',
    component: LapTopComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LapTopDetailComponent,
    resolve: {
      lapTop: LapTopRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LapTopUpdateComponent,
    resolve: {
      lapTop: LapTopRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LapTopUpdateComponent,
    resolve: {
      lapTop: LapTopRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lapTopRoute)],
  exports: [RouterModule],
})
export class LapTopRoutingModule {}
