import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILapTop } from '../lap-top.model';
import { LapTopService } from '../service/lap-top.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './lap-top-delete-dialog.component.html',
})
export class LapTopDeleteDialogComponent {
  lapTop?: ILapTop;

  constructor(protected lapTopService: LapTopService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lapTopService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
