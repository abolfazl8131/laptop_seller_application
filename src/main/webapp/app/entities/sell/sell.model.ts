import { ICustomer } from 'app/entities/customer/customer.model';
import { ILapTop } from 'app/entities/lap-top/lap-top.model';

export interface ISell {
  id: number;
  sellId?: number | null;
  date?: string | null;
  customer?: Pick<ICustomer, 'id'> | null;
  lapTop?: Pick<ILapTop, 'id'> | null;
}

export type NewSell = Omit<ISell, 'id'> & { id: null };
