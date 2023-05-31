import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LapTopComponent } from './list/lap-top.component';
import { LapTopDetailComponent } from './detail/lap-top-detail.component';
import { LapTopUpdateComponent } from './update/lap-top-update.component';
import { LapTopDeleteDialogComponent } from './delete/lap-top-delete-dialog.component';
import { LapTopRoutingModule } from './route/lap-top-routing.module';

@NgModule({
  imports: [SharedModule, LapTopRoutingModule],
  declarations: [LapTopComponent, LapTopDetailComponent, LapTopUpdateComponent, LapTopDeleteDialogComponent],
})
export class LapTopModule {}
