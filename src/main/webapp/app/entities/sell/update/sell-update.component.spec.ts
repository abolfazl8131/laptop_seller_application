import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SellFormService } from './sell-form.service';
import { SellService } from '../service/sell.service';
import { ISell } from '../sell.model';
import { ILapTop } from 'app/entities/lap-top/lap-top.model';
import { LapTopService } from 'app/entities/lap-top/service/lap-top.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { SellUpdateComponent } from './sell-update.component';

describe('Sell Management Update Component', () => {
  let comp: SellUpdateComponent;
  let fixture: ComponentFixture<SellUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sellFormService: SellFormService;
  let sellService: SellService;
  let lapTopService: LapTopService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SellUpdateComponent],
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
      .overrideTemplate(SellUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SellUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sellFormService = TestBed.inject(SellFormService);
    sellService = TestBed.inject(SellService);
    lapTopService = TestBed.inject(LapTopService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call lapTop query and add missing value', () => {
      const sell: ISell = { id: 456 };
      const lapTop: ILapTop = { id: 96889 };
      sell.lapTop = lapTop;

      const lapTopCollection: ILapTop[] = [{ id: 37542 }];
      jest.spyOn(lapTopService, 'query').mockReturnValue(of(new HttpResponse({ body: lapTopCollection })));
      const expectedCollection: ILapTop[] = [lapTop, ...lapTopCollection];
      jest.spyOn(lapTopService, 'addLapTopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sell });
      comp.ngOnInit();

      expect(lapTopService.query).toHaveBeenCalled();
      expect(lapTopService.addLapTopToCollectionIfMissing).toHaveBeenCalledWith(lapTopCollection, lapTop);
      expect(comp.lapTopsCollection).toEqual(expectedCollection);
    });

    it('Should call Customer query and add missing value', () => {
      const sell: ISell = { id: 456 };
      const customer: ICustomer = { id: 62206 };
      sell.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 25396 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sell });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(expect.objectContaining)
      );
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sell: ISell = { id: 456 };
      const lapTop: ILapTop = { id: 9117 };
      sell.lapTop = lapTop;
      const customer: ICustomer = { id: 39846 };
      sell.customer = customer;

      activatedRoute.data = of({ sell });
      comp.ngOnInit();

      expect(comp.lapTopsCollection).toContain(lapTop);
      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.sell).toEqual(sell);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISell>>();
      const sell = { id: 123 };
      jest.spyOn(sellFormService, 'getSell').mockReturnValue(sell);
      jest.spyOn(sellService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sell });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sell }));
      saveSubject.complete();

      // THEN
      expect(sellFormService.getSell).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sellService.update).toHaveBeenCalledWith(expect.objectContaining(sell));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISell>>();
      const sell = { id: 123 };
      jest.spyOn(sellFormService, 'getSell').mockReturnValue({ id: null });
      jest.spyOn(sellService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sell: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sell }));
      saveSubject.complete();

      // THEN
      expect(sellFormService.getSell).toHaveBeenCalled();
      expect(sellService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISell>>();
      const sell = { id: 123 };
      jest.spyOn(sellService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sell });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sellService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLapTop', () => {
      it('Should forward to lapTopService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(lapTopService, 'compareLapTop');
        comp.compareLapTop(entity, entity2);
        expect(lapTopService.compareLapTop).toHaveBeenCalledWith(entity, entity2);
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
