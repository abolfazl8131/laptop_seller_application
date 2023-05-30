import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LapTopFormService } from './lap-top-form.service';
import { LapTopService } from '../service/lap-top.service';
import { ILapTop } from '../lap-top.model';
import { ISeller } from 'app/entities/seller/seller.model';
import { SellerService } from 'app/entities/seller/service/seller.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { LapTopUpdateComponent } from './lap-top-update.component';

describe('LapTop Management Update Component', () => {
  let comp: LapTopUpdateComponent;
  let fixture: ComponentFixture<LapTopUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lapTopFormService: LapTopFormService;
  let lapTopService: LapTopService;
  let sellerService: SellerService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LapTopUpdateComponent],
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
      .overrideTemplate(LapTopUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LapTopUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lapTopFormService = TestBed.inject(LapTopFormService);
    lapTopService = TestBed.inject(LapTopService);
    sellerService = TestBed.inject(SellerService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Seller query and add missing value', () => {
      const lapTop: ILapTop = { id: 456 };
      const seller: ISeller = { id: 80439 };
      lapTop.seller = seller;

      const sellerCollection: ISeller[] = [{ id: 78521 }];
      jest.spyOn(sellerService, 'query').mockReturnValue(of(new HttpResponse({ body: sellerCollection })));
      const additionalSellers = [seller];
      const expectedCollection: ISeller[] = [...additionalSellers, ...sellerCollection];
      jest.spyOn(sellerService, 'addSellerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lapTop });
      comp.ngOnInit();

      expect(sellerService.query).toHaveBeenCalled();
      expect(sellerService.addSellerToCollectionIfMissing).toHaveBeenCalledWith(
        sellerCollection,
        ...additionalSellers.map(expect.objectContaining)
      );
      expect(comp.sellersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Customer query and add missing value', () => {
      const lapTop: ILapTop = { id: 456 };
      const customer: ICustomer = { id: 10182 };
      lapTop.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 82126 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lapTop });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(expect.objectContaining)
      );
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lapTop: ILapTop = { id: 456 };
      const seller: ISeller = { id: 88761 };
      lapTop.seller = seller;
      const customer: ICustomer = { id: 16465 };
      lapTop.customer = customer;

      activatedRoute.data = of({ lapTop });
      comp.ngOnInit();

      expect(comp.sellersSharedCollection).toContain(seller);
      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.lapTop).toEqual(lapTop);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILapTop>>();
      const lapTop = { id: 123 };
      jest.spyOn(lapTopFormService, 'getLapTop').mockReturnValue(lapTop);
      jest.spyOn(lapTopService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lapTop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lapTop }));
      saveSubject.complete();

      // THEN
      expect(lapTopFormService.getLapTop).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lapTopService.update).toHaveBeenCalledWith(expect.objectContaining(lapTop));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILapTop>>();
      const lapTop = { id: 123 };
      jest.spyOn(lapTopFormService, 'getLapTop').mockReturnValue({ id: null });
      jest.spyOn(lapTopService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lapTop: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lapTop }));
      saveSubject.complete();

      // THEN
      expect(lapTopFormService.getLapTop).toHaveBeenCalled();
      expect(lapTopService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILapTop>>();
      const lapTop = { id: 123 };
      jest.spyOn(lapTopService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lapTop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lapTopService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSeller', () => {
      it('Should forward to sellerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sellerService, 'compareSeller');
        comp.compareSeller(entity, entity2);
        expect(sellerService.compareSeller).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCustomer', () => {
      it('Should forward to customerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(customerService, 'compareCustomer');
        comp.compareCustomer(entity, entity2);
        expect(customerService.compareCustomer).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
