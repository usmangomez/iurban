import { UpperCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-language-switcher',
  imports: [UpperCasePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  readonly availableLanguages = input<string[]>([]);

  protected readonly translateService = inject(TranslateService);

  switchLang(lang: string): void {
    this.translateService.use(lang);
  }
}
