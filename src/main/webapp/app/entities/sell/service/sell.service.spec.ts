import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISell } from '../sell.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sell.test-samples';

import { SellService } from './sell.service';

const requireRestSample: ISell = {
  ...sampleWithRequiredData,
};

describe('Sell Service', () => {
  let service: SellService;
  let httpMock: HttpTestingController;
  let expectedResult: ISell | ISell[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SellService);
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

    it('should return a list of Sell', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    describe('addSellToCollectionIfMissing', () => {
      it('should add a Sell to an empty array', () => {
        const sell: ISell = sampleWithRequiredData;
        expectedResult = service.addSellToCollectionIfMissing([], sell);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sell);
      });

      it('should not add a Sell to an array that contains it', () => {
        const sell: ISell = sampleWithRequiredData;
        const sellCollection: ISell[] = [
          {
            ...sell,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSellToCollectionIfMissing(sellCollection, sell);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sell to an array that doesn't contain it", () => {
        const sell: ISell = sampleWithRequiredData;
        const sellCollection: ISell[] = [sampleWithPartialData];
        expectedResult = service.addSellToCollectionIfMissing(sellCollection, sell);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sell);
      });

      it('should add only unique Sell to an array', () => {
        const sellArray: ISell[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sellCollection: ISell[] = [sampleWithRequiredData];
        expectedResult = service.addSellToCollectionIfMissing(sellCollection, ...sellArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sell: ISell = sampleWithRequiredData;
        const sell2: ISell = sampleWithPartialData;
        expectedResult = service.addSellToCollectionIfMissing([], sell, sell2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sell);
        expect(expectedResult).toContain(sell2);
      });

      it('should accept null and undefined values', () => {
        const sell: ISell = sampleWithRequiredData;
        expectedResult = service.addSellToCollectionIfMissing([], null, sell, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sell);
      });

      it('should return initial array if no Sell is added', () => {
        const sellCollection: ISell[] = [sampleWithRequiredData];
        expectedResult = service.addSellToCollectionIfMissing(sellCollection, undefined, null);
        expect(expectedResult).toEqual(sellCollection);
      });
    });

    describe('compareSell', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSell(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSell(entity1, entity2);
        const compareResult2 = service.compareSell(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSell(entity1, entity2);
        const compareResult2 = service.compareSell(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSell(entity1, entity2);
        const compareResult2 = service.compareSell(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
