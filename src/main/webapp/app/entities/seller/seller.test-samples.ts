import { ISeller, NewSeller } from './seller.model';

export const sampleWithRequiredData: ISeller = {
  id: 23525,
};

export const sampleWithPartialData: ISeller = {
  id: 94737,
  iD: 62791,
  name: 'Generic',
  phoneNumber: 'Soap demand-driven Officer',
};

export const sampleWithFullData: ISeller = {
  id: 63541,
  iD: 6720,
  name: '5th back-end Fantastic',
  phoneNumber: 'Fantastic Checking',
};

export const sampleWithNewData: NewSeller = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
