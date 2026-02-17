import { Component, effect, inject, input } from '@angular/core';
import { DetailStore } from './store/detail.store';

@Component({
  selector: 'app-detail',
  imports: [],
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
