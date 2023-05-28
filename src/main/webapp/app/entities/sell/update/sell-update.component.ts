import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SellFormService, SellFormGroup } from './sell-form.service';
import { ISell } from '../sell.model';
import { SellService } from '../service/sell.service';
import { ILapTop } from 'app/entities/lap-top/lap-top.model';
import { LapTopService } from 'app/entities/lap-top/service/lap-top.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

@Component({
  selector: 'jhi-sell-update',
  templateUrl: './sell-update.component.html',
})
export class SellUpdateComponent implements OnInit {
  isSaving = false;
  sell: ISell | null = null;

  lapTopsCollection: ILapTop[] = [];
  customersSharedCollection: ICustomer[] = [];

  editForm: SellFormGroup = this.sellFormService.createSellFormGroup();

  constructor(
    protected sellService: SellService,
    protected sellFormService: SellFormService,
    protected lapTopService: LapTopService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLapTop = (o1: ILapTop | null, o2: ILapTop | null): boolean => this.lapTopService.compareLapTop(o1, o2);

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sell }) => {
      this.sell = sell;
      if (sell) {
        this.updateForm(sell);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sell = this.sellFormService.getSell(this.editForm);
    if (sell.id !== null) {
      this.subscribeToSaveResponse(this.sellService.update(sell));
    } else {
      this.subscribeToSaveResponse(this.sellService.create(sell));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISell>>): void {
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

  protected updateForm(sell: ISell): void {
    this.sell = sell;
    this.sellFormService.resetForm(this.editForm, sell);

    this.lapTopsCollection = this.lapTopService.addLapTopToCollectionIfMissing<ILapTop>(this.lapTopsCollection, sell.lapTop);
    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      sell.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.lapTopService
      .query({ filter: 'sell-is-null' })
      .pipe(map((res: HttpResponse<ILapTop[]>) => res.body ?? []))
      .pipe(map((lapTops: ILapTop[]) => this.lapTopService.addLapTopToCollectionIfMissing<ILapTop>(lapTops, this.sell?.lapTop)))
      .subscribe((lapTops: ILapTop[]) => (this.lapTopsCollection = lapTops));

    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) => this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.sell?.customer))
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }
}
