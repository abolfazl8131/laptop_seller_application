import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SellerFormService, SellerFormGroup } from './seller-form.service';
import { ISeller } from '../seller.model';
import { SellerService } from '../service/seller.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-seller-update',
  templateUrl: './seller-update.component.html',
})
export class SellerUpdateComponent implements OnInit {
  isSaving = false;
  seller: ISeller | null = null;

  locationsCollection: ILocation[] = [];

  editForm: SellerFormGroup = this.sellerFormService.createSellerFormGroup();

  constructor(
    protected sellerService: SellerService,
    protected sellerFormService: SellerFormService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLocation = (o1: ILocation | null, o2: ILocation | null): boolean => this.locationService.compareLocation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ seller }) => {
      this.seller = seller;
      if (seller) {
        this.updateForm(seller);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const seller = this.sellerFormService.getSeller(this.editForm);
    if (seller.id !== null) {
      this.subscribeToSaveResponse(this.sellerService.update(seller));
    } else {
      this.subscribeToSaveResponse(this.sellerService.create(seller));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeller>>): void {
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

  protected updateForm(seller: ISeller): void {
    this.seller = seller;
    this.sellerFormService.resetForm(this.editForm, seller);

    this.locationsCollection = this.locationService.addLocationToCollectionIfMissing<ILocation>(this.locationsCollection, seller.location);
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'seller-is-null' })
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) => this.locationService.addLocationToCollectionIfMissing<ILocation>(locations, this.seller?.location))
      )
      .subscribe((locations: ILocation[]) => (this.locationsCollection = locations));
  }
}
