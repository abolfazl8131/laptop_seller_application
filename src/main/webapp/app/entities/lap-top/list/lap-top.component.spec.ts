import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LapTopService } from '../service/lap-top.service';

import { LapTopComponent } from './lap-top.component';

describe('LapTop Management Component', () => {
  let comp: LapTopComponent;
  let fixture: ComponentFixture<LapTopComponent>;
  let service: LapTopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'lap-top', component: LapTopComponent }]), HttpClientTestingModule],
      declarations: [LapTopComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LapTopComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LapTopComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LapTopService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.lapTops?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to lapTopService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLapTopIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLapTopIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
