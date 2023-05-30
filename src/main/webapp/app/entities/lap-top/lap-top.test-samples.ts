import { ILapTop, NewLapTop } from './lap-top.model';

export const sampleWithRequiredData: ILapTop = {
  id: 81101,
};

export const sampleWithPartialData: ILapTop = {
  id: 77082,
  company: 'Lights',
  datepublished: 'primary red',
};

export const sampleWithFullData: ILapTop = {
  id: 32026,
  code: 30094,
  company: 'USB infomediaries Pre-emptive',
  model: 'Refined',
  datepublished: 'e-tailers',
  price: 36143,
  heigth: 39218,
  width: 82321,
  battery: 'proactive',
  description: 'Sports blue',
};

export const sampleWithNewData: NewLapTop = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
