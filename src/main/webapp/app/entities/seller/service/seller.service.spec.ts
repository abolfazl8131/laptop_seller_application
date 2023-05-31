import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISeller } from '../seller.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../seller.test-samples';

import { SellerService } from './seller.service';

const requireRestSample: ISeller = {
  ...sampleWithRequiredData,
};

describe('Seller Service', () => {
  let service: SellerService;
  let httpMock: HttpTestingController;
  let expectedResult: ISeller | ISeller[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SellerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Seller', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const seller = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(seller).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Seller', () => {
      const seller = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(seller).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Seller', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Seller', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Seller', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSellerToCollectionIfMissing', () => {
      it('should add a Seller to an empty array', () => {
        const seller: ISeller = sampleWithRequiredData;
        expectedResult = service.addSellerToCollectionIfMissing([], seller);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seller);
      });

      it('should not add a Seller to an array that contains it', () => {
        const seller: ISeller = sampleWithRequiredData;
        const sellerCollection: ISeller[] = [
          {
            ...seller,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, seller);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Seller to an array that doesn't contain it", () => {
        const seller: ISeller = sampleWithRequiredData;
        const sellerCollection: ISeller[] = [sampleWithPartialData];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, seller);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seller);
      });

      it('should add only unique Seller to an array', () => {
        const sellerArray: ISeller[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sellerCollection: ISeller[] = [sampleWithRequiredData];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, ...sellerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const seller: ISeller = sampleWithRequiredData;
        const seller2: ISeller = sampleWithPartialData;
        expectedResult = service.addSellerToCollectionIfMissing([], seller, seller2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seller);
        expect(expectedResult).toContain(seller2);
      });

      it('should accept null and undefined values', () => {
        const seller: ISeller = sampleWithRequiredData;
        expectedResult = service.addSellerToCollectionIfMissing([], null, seller, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seller);
      });

      it('should return initial array if no Seller is added', () => {
        const sellerCollection: ISeller[] = [sampleWithRequiredData];
        expectedResult = service.addSellerToCollectionIfMissing(sellerCollection, undefined, null);
        expect(expectedResult).toEqual(sellerCollection);
      });
    });

    describe('compareSeller', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSeller(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSeller(entity1, entity2);
        const compareResult2 = service.compareSeller(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSeller(entity1, entity2);
        const compareResult2 = service.compareSeller(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSeller(entity1, entity2);
        const compareResult2 = service.compareSeller(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});