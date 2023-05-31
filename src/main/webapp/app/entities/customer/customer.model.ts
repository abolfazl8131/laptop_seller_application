export interface ICustomer {
  id: number;
  iD?: number | null;
  phoneNumber?: string | null;
  name?: string | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
