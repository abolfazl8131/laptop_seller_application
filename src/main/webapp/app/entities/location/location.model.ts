import { ICustomer } from 'app/entities/customer/customer.model';

export interface ILocation {
  id: number;
  city?: string | null;
  address?: string | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewLocation = Omit<ILocation, 'id'> & { id: null };
