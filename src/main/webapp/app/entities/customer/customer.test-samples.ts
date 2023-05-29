import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 24379,
};

export const sampleWithPartialData: ICustomer = {
  id: 25384,
  phoneNumber: 'Communications Club',
  name: 'generate Loan generating',
};

export const sampleWithFullData: ICustomer = {
  id: 5358,
  iD: 7870,
  phoneNumber: 'Agent Cotton',
  name: 'hard product',
};

export const sampleWithNewData: NewCustomer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
