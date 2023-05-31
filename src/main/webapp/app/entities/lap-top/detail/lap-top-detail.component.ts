import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILapTop } from '../lap-top.model';

@Component({
  selector: 'jhi-lap-top-detail',
  templateUrl: './lap-top-detail.component.html',
})
export class LapTopDetailComponent implements OnInit {
  lapTop: ILapTop | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lapTop }) => {
      this.lapTop = lapTop;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
