import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lap-top.test-samples';

import { LapTopFormService } from './lap-top-form.service';

describe('LapTop Form Service', () => {
  let service: LapTopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LapTopFormService);
  });

  describe('Service methods', () => {
    describe('createLapTopFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLapTopFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            company: expect.any(Object),
            model: expect.any(Object),
            datepublished: expect.any(Object),
            price: expect.any(Object),
            heigth: expect.any(Object),
            width: expect.any(Object),
            battery: expect.any(Object),
            description: expect.any(Object),
            seller: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });

      it('passing ILapTop should create a new form with FormGroup', () => {
        const formGroup = service.createLapTopFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            company: expect.any(Object),
            model: expect.any(Object),
            datepublished: expect.any(Object),
            price: expect.any(Object),
            heigth: expect.any(Object),
            width: expect.any(Object),
            battery: expect.any(Object),
            description: expect.any(Object),
            seller: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });
    });

    describe('getLapTop', () => {
      it('should return NewLapTop for default LapTop initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLapTopFormGroup(sampleWithNewData);

        const lapTop = service.getLapTop(formGroup) as any;

        expect(lapTop).toMatchObject(sampleWithNewData);
      });

      it('should return NewLapTop for empty LapTop initial value', () => {
        const formGroup = service.createLapTopFormGroup();

        const lapTop = service.getLapTop(formGroup) as any;

        expect(lapTop).toMatchObject({});
      });

      it('should return ILapTop', () => {
        const formGroup = service.createLapTopFormGroup(sampleWithRequiredData);

        const lapTop = service.getLapTop(formGroup) as any;

        expect(lapTop).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILapTop should not enable id FormControl', () => {
        const formGroup = service.createLapTopFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLapTop should disable id FormControl', () => {
        const formGroup = service.createLapTopFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
