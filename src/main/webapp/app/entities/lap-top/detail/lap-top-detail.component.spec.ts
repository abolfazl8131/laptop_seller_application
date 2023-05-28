import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LapTopDetailComponent } from './lap-top-detail.component';

describe('LapTop Management Detail Component', () => {
  let comp: LapTopDetailComponent;
  let fixture: ComponentFixture<LapTopDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LapTopDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lapTop: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LapTopDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LapTopDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lapTop on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lapTop).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
