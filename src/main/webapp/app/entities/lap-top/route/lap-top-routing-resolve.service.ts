import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILapTop } from '../lap-top.model';
import { LapTopService } from '../service/lap-top.service';

@Injectable({ providedIn: 'root' })
export class LapTopRoutingResolveService implements Resolve<ILapTop | null> {
  constructor(protected service: LapTopService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILapTop | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lapTop: HttpResponse<ILapTop>) => {
          if (lapTop.body) {
            return of(lapTop.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
