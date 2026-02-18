import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: '[carouselItem]' })
export class CarouselItemDirective {
  readonly template = inject(TemplateRef<{ $implicit: unknown }>);
}
