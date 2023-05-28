import { ILapTop } from 'app/entities/lap-top/lap-top.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface ISell {
  id: number;
  sellId?: number | null;
  date?: string | null;
  lapTop?: Pick<ILapTop, 'id'> | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewSell = Omit<ISell, 'id'> & { id: null };
