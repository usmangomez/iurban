import { Component, effect, inject, input } from '@angular/core';
import { DetailStore } from './store/detail.store';
import { DetailSkeleton } from './components/detail-skeleton/detail-skeleton';

@Component({
  selector: 'app-detail',
  imports: [DetailSkeleton],
  providers: [DetailStore],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail {
  readonly slug = input.required<string>();

  protected readonly store = inject(DetailStore);

  constructor() {
    effect(() => {
      this.store.loadBySlug(this.slug());
    });
  }
}
