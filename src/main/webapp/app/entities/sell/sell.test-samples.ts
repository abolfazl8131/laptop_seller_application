import { ISell, NewSell } from './sell.model';

export const sampleWithRequiredData: ISell = {
  id: 52110,
};

export const sampleWithPartialData: ISell = {
  id: 44515,
  date: 'niches',
};

export const sampleWithFullData: ISell = {
  id: 43415,
  sellId: 11340,
  date: 'Tools interface',
};

export const sampleWithNewData: NewSell = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
