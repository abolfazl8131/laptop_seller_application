import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SellerFormService } from './seller-form.service';
import { SellerService } from '../service/seller.service';
import { ISeller } from '../seller.model';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { SellerUpdateComponent } from './seller-update.component';

describe('Seller Management Update Component', () => {
  let comp: SellerUpdateComponent;
  let fixture: ComponentFixture<SellerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sellerFormService: SellerFormService;
  let sellerService: SellerService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SellerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SellerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SellerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sellerFormService = TestBed.inject(SellerFormService);
    sellerService = TestBed.inject(SellerService);
    locationService = TestBed.inject(LocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const seller: ISeller = { id: 456 };
      const location: ILocation = { id: 93772 };
      seller.location = location;

      const locationCollection: ILocation[] = [{ id: 54970 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocation[] = [location, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const seller: ISeller = { id: 456 };
      const location: ILocation = { id: 11937 };
      seller.location = location;

      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      expect(comp.locationsCollection).toContain(location);
      expect(comp.seller).toEqual(seller);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeller>>();
      const seller = { id: 123 };
      jest.spyOn(sellerFormService, 'getSeller').mockReturnValue(seller);
      jest.spyOn(sellerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seller }));
      saveSubject.complete();

      // THEN
      expect(sellerFormService.getSeller).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sellerService.update).toHaveBeenCalledWith(expect.objectContaining(seller));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeller>>();
      const seller = { id: 123 };
      jest.spyOn(sellerFormService, 'getSeller').mockReturnValue({ id: null });
      jest.spyOn(sellerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seller: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: seller }));
      saveSubject.complete();

      // THEN
      expect(sellerFormService.getSeller).toHaveBeenCalled();
      expect(sellerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeller>>();
      const seller = { id: 123 };
      jest.spyOn(sellerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ seller });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sellerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLocation', () => {
      it('Should forward to locationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(locationService, 'compareLocation');
        comp.compareLocation(entity, entity2);
        expect(locationService.compareLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
