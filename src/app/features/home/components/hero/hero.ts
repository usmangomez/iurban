import { Component, computed, inject, input } from '@angular/core';
import { HeroSection } from '../../../../core/models/home.model';
import { BrandingStore } from '../../../../store/branding.store';
import { TranslateService } from '../../../../core/services/translate.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly hero = input<HeroSection | null>();

  readonly videoSrc = computed(() => this.hero()?.heroMultimedia[0].src || '');
  readonly title = computed(() => this.translateService.localize(this.hero()?.headerName));

  protected readonly brandingStore = inject(BrandingStore);
  private readonly translateService = inject(TranslateService);
}
