import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISeller, NewSeller } from '../seller.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISeller for edit and NewSellerFormGroupInput for create.
 */
type SellerFormGroupInput = ISeller | PartialWithRequiredKeyOf<NewSeller>;

type SellerFormDefaults = Pick<NewSeller, 'id'>;

type SellerFormGroupContent = {
  id: FormControl<ISeller['id'] | NewSeller['id']>;
  iD: FormControl<ISeller['iD']>;
  name: FormControl<ISeller['name']>;
  phoneNumber: FormControl<ISeller['phoneNumber']>;
  location: FormControl<ISeller['location']>;
};

export type SellerFormGroup = FormGroup<SellerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SellerFormService {
  createSellerFormGroup(seller: SellerFormGroupInput = { id: null }): SellerFormGroup {
    const sellerRawValue = {
      ...this.getFormDefaults(),
      ...seller,
    };
    return new FormGroup<SellerFormGroupContent>({
      id: new FormControl(
        { value: sellerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      iD: new FormControl(sellerRawValue.iD),
      name: new FormControl(sellerRawValue.name),
      phoneNumber: new FormControl(sellerRawValue.phoneNumber),
      location: new FormControl(sellerRawValue.location),
    });
  }

  getSeller(form: SellerFormGroup): ISeller | NewSeller {
    return form.getRawValue() as ISeller | NewSeller;
  }

  resetForm(form: SellerFormGroup, seller: SellerFormGroupInput): void {
    const sellerRawValue = { ...this.getFormDefaults(), ...seller };
    form.reset(
      {
        ...sellerRawValue,
        id: { value: sellerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SellerFormDefaults {
    return {
      id: null,
    };
  }
}
