import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILapTop, NewLapTop } from '../lap-top.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILapTop for edit and NewLapTopFormGroupInput for create.
 */
type LapTopFormGroupInput = ILapTop | PartialWithRequiredKeyOf<NewLapTop>;

type LapTopFormDefaults = Pick<NewLapTop, 'id'>;

type LapTopFormGroupContent = {
  id: FormControl<ILapTop['id'] | NewLapTop['id']>;
  code: FormControl<ILapTop['code']>;
  company: FormControl<ILapTop['company']>;
  model: FormControl<ILapTop['model']>;
  datepublished: FormControl<ILapTop['datepublished']>;
  price: FormControl<ILapTop['price']>;
  heigth: FormControl<ILapTop['heigth']>;
  width: FormControl<ILapTop['width']>;
  battery: FormControl<ILapTop['battery']>;
  description: FormControl<ILapTop['description']>;
  seller: FormControl<ILapTop['seller']>;
};

export type LapTopFormGroup = FormGroup<LapTopFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LapTopFormService {
  createLapTopFormGroup(lapTop: LapTopFormGroupInput = { id: null }): LapTopFormGroup {
    const lapTopRawValue = {
      ...this.getFormDefaults(),
      ...lapTop,
    };
    return new FormGroup<LapTopFormGroupContent>({
      id: new FormControl(
        { value: lapTopRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(lapTopRawValue.code),
      company: new FormControl(lapTopRawValue.company),
      model: new FormControl(lapTopRawValue.model),
      datepublished: new FormControl(lapTopRawValue.datepublished),
      price: new FormControl(lapTopRawValue.price),
      heigth: new FormControl(lapTopRawValue.heigth),
      width: new FormControl(lapTopRawValue.width),
      battery: new FormControl(lapTopRawValue.battery),
      description: new FormControl(lapTopRawValue.description),
      seller: new FormControl(lapTopRawValue.seller),
    });
  }

  getLapTop(form: LapTopFormGroup): ILapTop | NewLapTop {
    return form.getRawValue() as ILapTop | NewLapTop;
  }

  resetForm(form: LapTopFormGroup, lapTop: LapTopFormGroupInput): void {
    const lapTopRawValue = { ...this.getFormDefaults(), ...lapTop };
    form.reset(
      {
        ...lapTopRawValue,
        id: { value: lapTopRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LapTopFormDefaults {
    return {
      id: null,
    };
  }
}
