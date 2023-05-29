import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'lap-top',
        data: { pageTitle: 'myApp.lapTop.home.title' },
        loadChildren: () => import('./lap-top/lap-top.module').then(m => m.LapTopModule),
      },
      {
        path: 'seller',
        data: { pageTitle: 'myApp.seller.home.title' },
        loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'myApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'myApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'sell',
        data: { pageTitle: 'myApp.sell.home.title' },
        loadChildren: () => import('./sell/sell.module').then(m => m.SellModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
