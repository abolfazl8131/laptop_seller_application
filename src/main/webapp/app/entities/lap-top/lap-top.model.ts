import { ISeller } from 'app/entities/seller/seller.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface ILapTop {
  id: number;
  code?: number | null;
  company?: string | null;
  model?: string | null;
  datepublished?: string | null;
  price?: number | null;
  heigth?: number | null;
  width?: number | null;
  battery?: string | null;
  description?: string | null;
  seller?: Pick<ISeller, 'id'> | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewLapTop = Omit<ILapTop, 'id'> & { id: null };
