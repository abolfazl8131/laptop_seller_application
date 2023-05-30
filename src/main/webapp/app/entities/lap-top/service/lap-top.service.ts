import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILapTop, NewLapTop } from '../lap-top.model';

export type PartialUpdateLapTop = Partial<ILapTop> & Pick<ILapTop, 'id'>;

export type EntityResponseType = HttpResponse<ILapTop>;
export type EntityArrayResponseType = HttpResponse<ILapTop[]>;

@Injectable({ providedIn: 'root' })
export class LapTopService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lap-tops');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lapTop: NewLapTop): Observable<EntityResponseType> {
    return this.http.post<ILapTop>(this.resourceUrl, lapTop, { observe: 'response' });
  }

  update(lapTop: ILapTop): Observable<EntityResponseType> {
    return this.http.put<ILapTop>(`${this.resourceUrl}/${this.getLapTopIdentifier(lapTop)}`, lapTop, { observe: 'response' });
  }

  partialUpdate(lapTop: PartialUpdateLapTop): Observable<EntityResponseType> {
    return this.http.patch<ILapTop>(`${this.resourceUrl}/${this.getLapTopIdentifier(lapTop)}`, lapTop, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILapTop>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILapTop[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLapTopIdentifier(lapTop: Pick<ILapTop, 'id'>): number {
    return lapTop.id;
  }

  compareLapTop(o1: Pick<ILapTop, 'id'> | null, o2: Pick<ILapTop, 'id'> | null): boolean {
    return o1 && o2 ? this.getLapTopIdentifier(o1) === this.getLapTopIdentifier(o2) : o1 === o2;
  }

  addLapTopToCollectionIfMissing<Type extends Pick<ILapTop, 'id'>>(
    lapTopCollection: Type[],
    ...lapTopsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lapTops: Type[] = lapTopsToCheck.filter(isPresent);
    if (lapTops.length > 0) {
      const lapTopCollectionIdentifiers = lapTopCollection.map(lapTopItem => this.getLapTopIdentifier(lapTopItem)!);
      const lapTopsToAdd = lapTops.filter(lapTopItem => {
        const lapTopIdentifier = this.getLapTopIdentifier(lapTopItem);
        if (lapTopCollectionIdentifiers.includes(lapTopIdentifier)) {
          return false;
        }
        lapTopCollectionIdentifiers.push(lapTopIdentifier);
        return true;
      });
      return [...lapTopsToAdd, ...lapTopCollection];
    }
    return lapTopCollection;
  }
}
