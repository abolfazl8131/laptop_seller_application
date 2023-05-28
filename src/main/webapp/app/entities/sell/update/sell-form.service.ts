import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISell, NewSell } from '../sell.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISell for edit and NewSellFormGroupInput for create.
 */
type SellFormGroupInput = ISell | PartialWithRequiredKeyOf<NewSell>;

type SellFormDefaults = Pick<NewSell, 'id'>;

type SellFormGroupContent = {
  id: FormControl<ISell['id'] | NewSell['id']>;
  sellId: FormControl<ISell['sellId']>;
  date: FormControl<ISell['date']>;
  lapTop: FormControl<ISell['lapTop']>;
  customer: FormControl<ISell['customer']>;
};

export type SellFormGroup = FormGroup<SellFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SellFormService {
  createSellFormGroup(sell: SellFormGroupInput = { id: null }): SellFormGroup {
    const sellRawValue = {
      ...this.getFormDefaults(),
      ...sell,
    };
    return new FormGroup<SellFormGroupContent>({
      id: new FormControl(
        { value: sellRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      sellId: new FormControl(sellRawValue.sellId),
      date: new FormControl(sellRawValue.date),
      lapTop: new FormControl(sellRawValue.lapTop),
      customer: new FormControl(sellRawValue.customer),
    });
  }

  getSell(form: SellFormGroup): ISell | NewSell {
    return form.getRawValue() as ISell | NewSell;
  }

  resetForm(form: SellFormGroup, sell: SellFormGroupInput): void {
    const sellRawValue = { ...this.getFormDefaults(), ...sell };
    form.reset(
      {
        ...sellRawValue,
        id: { value: sellRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SellFormDefaults {
    return {
      id: null,
    };
  }
}
