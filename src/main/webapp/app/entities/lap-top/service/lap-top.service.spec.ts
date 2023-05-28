import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILapTop } from '../lap-top.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../lap-top.test-samples';

import { LapTopService } from './lap-top.service';

const requireRestSample: ILapTop = {
  ...sampleWithRequiredData,
};

describe('LapTop Service', () => {
  let service: LapTopService;
  let httpMock: HttpTestingController;
  let expectedResult: ILapTop | ILapTop[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LapTopService);
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

    it('should create a LapTop', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lapTop = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lapTop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LapTop', () => {
      const lapTop = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lapTop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LapTop', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LapTop', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LapTop', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLapTopToCollectionIfMissing', () => {
      it('should add a LapTop to an empty array', () => {
        const lapTop: ILapTop = sampleWithRequiredData;
        expectedResult = service.addLapTopToCollectionIfMissing([], lapTop);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lapTop);
      });

      it('should not add a LapTop to an array that contains it', () => {
        const lapTop: ILapTop = sampleWithRequiredData;
        const lapTopCollection: ILapTop[] = [
          {
            ...lapTop,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLapTopToCollectionIfMissing(lapTopCollection, lapTop);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LapTop to an array that doesn't contain it", () => {
        const lapTop: ILapTop = sampleWithRequiredData;
        const lapTopCollection: ILapTop[] = [sampleWithPartialData];
        expectedResult = service.addLapTopToCollectionIfMissing(lapTopCollection, lapTop);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lapTop);
      });

      it('should add only unique LapTop to an array', () => {
        const lapTopArray: ILapTop[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lapTopCollection: ILapTop[] = [sampleWithRequiredData];
        expectedResult = service.addLapTopToCollectionIfMissing(lapTopCollection, ...lapTopArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lapTop: ILapTop = sampleWithRequiredData;
        const lapTop2: ILapTop = sampleWithPartialData;
        expectedResult = service.addLapTopToCollectionIfMissing([], lapTop, lapTop2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lapTop);
        expect(expectedResult).toContain(lapTop2);
      });

      it('should accept null and undefined values', () => {
        const lapTop: ILapTop = sampleWithRequiredData;
        expectedResult = service.addLapTopToCollectionIfMissing([], null, lapTop, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lapTop);
      });

      it('should return initial array if no LapTop is added', () => {
        const lapTopCollection: ILapTop[] = [sampleWithRequiredData];
        expectedResult = service.addLapTopToCollectionIfMissing(lapTopCollection, undefined, null);
        expect(expectedResult).toEqual(lapTopCollection);
      });
    });

    describe('compareLapTop', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLapTop(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLapTop(entity1, entity2);
        const compareResult2 = service.compareLapTop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLapTop(entity1, entity2);
        const compareResult2 = service.compareLapTop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLapTop(entity1, entity2);
        const compareResult2 = service.compareLapTop(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
