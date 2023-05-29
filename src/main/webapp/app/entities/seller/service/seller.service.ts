import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISeller, NewSeller } from '../seller.model';

export type PartialUpdateSeller = Partial<ISeller> & Pick<ISeller, 'id'>;

export type EntityResponseType = HttpResponse<ISeller>;
export type EntityArrayResponseType = HttpResponse<ISeller[]>;

@Injectable({ providedIn: 'root' })
export class SellerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sellers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(seller: NewSeller): Observable<EntityResponseType> {
    return this.http.post<ISeller>(this.resourceUrl, seller, { observe: 'response' });
  }

  update(seller: ISeller): Observable<EntityResponseType> {
    return this.http.put<ISeller>(`${this.resourceUrl}/${this.getSellerIdentifier(seller)}`, seller, { observe: 'response' });
  }

  partialUpdate(seller: PartialUpdateSeller): Observable<EntityResponseType> {
    return this.http.patch<ISeller>(`${this.resourceUrl}/${this.getSellerIdentifier(seller)}`, seller, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeller>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeller[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSellerIdentifier(seller: Pick<ISeller, 'id'>): number {
    return seller.id;
  }

  compareSeller(o1: Pick<ISeller, 'id'> | null, o2: Pick<ISeller, 'id'> | null): boolean {
    return o1 && o2 ? this.getSellerIdentifier(o1) === this.getSellerIdentifier(o2) : o1 === o2;
  }

  addSellerToCollectionIfMissing<Type extends Pick<ISeller, 'id'>>(
    sellerCollection: Type[],
    ...sellersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sellers: Type[] = sellersToCheck.filter(isPresent);
    if (sellers.length > 0) {
      const sellerCollectionIdentifiers = sellerCollection.map(sellerItem => this.getSellerIdentifier(sellerItem)!);
      const sellersToAdd = sellers.filter(sellerItem => {
        const sellerIdentifier = this.getSellerIdentifier(sellerItem);
        if (sellerCollectionIdentifiers.includes(sellerIdentifier)) {
          return false;
        }
        sellerCollectionIdentifiers.push(sellerIdentifier);
        return true;
      });
      return [...sellersToAdd, ...sellerCollection];
    }
    return sellerCollection;
  }
}
