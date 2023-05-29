import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISell, NewSell } from '../sell.model';

export type PartialUpdateSell = Partial<ISell> & Pick<ISell, 'id'>;

export type EntityResponseType = HttpResponse<ISell>;
export type EntityArrayResponseType = HttpResponse<ISell[]>;

@Injectable({ providedIn: 'root' })
export class SellService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sells');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISell>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISell[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getSellIdentifier(sell: Pick<ISell, 'id'>): number {
    return sell.id;
  }

  compareSell(o1: Pick<ISell, 'id'> | null, o2: Pick<ISell, 'id'> | null): boolean {
    return o1 && o2 ? this.getSellIdentifier(o1) === this.getSellIdentifier(o2) : o1 === o2;
  }

  addSellToCollectionIfMissing<Type extends Pick<ISell, 'id'>>(
    sellCollection: Type[],
    ...sellsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sells: Type[] = sellsToCheck.filter(isPresent);
    if (sells.length > 0) {
      const sellCollectionIdentifiers = sellCollection.map(sellItem => this.getSellIdentifier(sellItem)!);
      const sellsToAdd = sells.filter(sellItem => {
        const sellIdentifier = this.getSellIdentifier(sellItem);
        if (sellCollectionIdentifiers.includes(sellIdentifier)) {
          return false;
        }
        sellCollectionIdentifiers.push(sellIdentifier);
        return true;
      });
      return [...sellsToAdd, ...sellCollection];
    }
    return sellCollection;
  }
}
