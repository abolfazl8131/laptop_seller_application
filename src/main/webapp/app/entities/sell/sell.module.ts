import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SellComponent } from './list/sell.component';
import { SellDetailComponent } from './detail/sell-detail.component';
import { SellRoutingModule } from './route/sell-routing.module';

@NgModule({
  imports: [SharedModule, SellRoutingModule],
  declarations: [SellComponent, SellDetailComponent],
})
export class SellModule {}
