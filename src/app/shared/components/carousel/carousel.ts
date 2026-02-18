import { Component, computed, contentChild, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CarouselItemDirective } from './carousel-item.directive';

@Component({
  selector: 'app-carousel',
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  readonly items = input.required<unknown[]>();
  readonly visibleCount = input(3);

  readonly itemTemplate = contentChild.required(CarouselItemDirective);

  readonly currentIndex = signal(0);

  readonly canGoPrev = computed(() => this.currentIndex() > 0);
  readonly canGoNext = computed(
    () => this.currentIndex() + this.visibleCount() < this.items().length,
  );
  readonly trackTransform = computed(
    () =>
      `translateX(calc(-1 * ${this.currentIndex()} * 100% / ${this.visibleCount()}))`,
  );

  prev(): void {
    if (this.canGoPrev()) this.currentIndex.update((i) => i - 1);
  }

  next(): void {
    if (this.canGoNext()) this.currentIndex.update((i) => i + 1);
  }
}
