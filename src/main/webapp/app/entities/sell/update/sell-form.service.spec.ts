import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sell.test-samples';

import { SellFormService } from './sell-form.service';

describe('Sell Form Service', () => {
  let service: SellFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellFormService);
  });

  describe('Service methods', () => {
    describe('createSellFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSellFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sellId: expect.any(Object),
            date: expect.any(Object),
            lapTop: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });

      it('passing ISell should create a new form with FormGroup', () => {
        const formGroup = service.createSellFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            sellId: expect.any(Object),
            date: expect.any(Object),
            lapTop: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });
    });

    describe('getSell', () => {
      it('should return NewSell for default Sell initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSellFormGroup(sampleWithNewData);

        const sell = service.getSell(formGroup) as any;

        expect(sell).toMatchObject(sampleWithNewData);
      });

      it('should return NewSell for empty Sell initial value', () => {
        const formGroup = service.createSellFormGroup();

        const sell = service.getSell(formGroup) as any;

        expect(sell).toMatchObject({});
      });

      it('should return ISell', () => {
        const formGroup = service.createSellFormGroup(sampleWithRequiredData);

        const sell = service.getSell(formGroup) as any;

        expect(sell).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISell should not enable id FormControl', () => {
        const formGroup = service.createSellFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSell should disable id FormControl', () => {
        const formGroup = service.createSellFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
