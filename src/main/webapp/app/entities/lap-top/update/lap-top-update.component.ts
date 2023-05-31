import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LapTopFormService, LapTopFormGroup } from './lap-top-form.service';
import { ILapTop } from '../lap-top.model';
import { LapTopService } from '../service/lap-top.service';
import { ISeller } from 'app/entities/seller/seller.model';
import { SellerService } from 'app/entities/seller/service/seller.service';

@Component({
  selector: 'jhi-lap-top-update',
  templateUrl: './lap-top-update.component.html',
})
export class LapTopUpdateComponent implements OnInit {
  isSaving = false;
  lapTop: ILapTop | null = null;

  sellersSharedCollection: ISeller[] = [];

  editForm: LapTopFormGroup = this.lapTopFormService.createLapTopFormGroup();

  constructor(
    protected lapTopService: LapTopService,
    protected lapTopFormService: LapTopFormService,
    protected sellerService: SellerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSeller = (o1: ISeller | null, o2: ISeller | null): boolean => this.sellerService.compareSeller(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lapTop }) => {
      this.lapTop = lapTop;
      if (lapTop) {
        this.updateForm(lapTop);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lapTop = this.lapTopFormService.getLapTop(this.editForm);
    if (lapTop.id !== null) {
      this.subscribeToSaveResponse(this.lapTopService.update(lapTop));
    } else {
      this.subscribeToSaveResponse(this.lapTopService.create(lapTop));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILapTop>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(lapTop: ILapTop): void {
    this.lapTop = lapTop;
    this.lapTopFormService.resetForm(this.editForm, lapTop);

    this.sellersSharedCollection = this.sellerService.addSellerToCollectionIfMissing<ISeller>(this.sellersSharedCollection, lapTop.seller);
  }

  protected loadRelationshipsOptions(): void {
    this.sellerService
      .query()
      .pipe(map((res: HttpResponse<ISeller[]>) => res.body ?? []))
      .pipe(map((sellers: ISeller[]) => this.sellerService.addSellerToCollectionIfMissing<ISeller>(sellers, this.lapTop?.seller)))
      .subscribe((sellers: ISeller[]) => (this.sellersSharedCollection = sellers));
  }
}
