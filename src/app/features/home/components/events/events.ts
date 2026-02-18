import { Component, input } from '@angular/core';
import { HomeItem } from '../../../../core/models/home.model';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { CarouselItemDirective } from '../../../../shared/components/carousel/carousel-item.directive';
import { Card } from '../../../../shared/components/card/card';
import { LocalizePipe } from '../../../../shared/pipes/localize.pipe';

@Component({
  selector: 'app-events',
  imports: [Carousel, CarouselItemDirective, Card, LocalizePipe],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events {
  readonly events = input<HomeItem[]>();
}
