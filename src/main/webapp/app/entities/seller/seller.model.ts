import { ILocation } from 'app/entities/location/location.model';

export interface ISeller {
  id: number;
  iD?: number | null;
  name?: string | null;
  phoneNumber?: string | null;
  location?: Pick<ILocation, 'id'> | null;
}

export type NewSeller = Omit<ISeller, 'id'> & { id: null };
