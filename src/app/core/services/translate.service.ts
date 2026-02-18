import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LocalizedString } from '../models/home.model';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly http = inject(HttpClient);

  readonly currentLang = signal('es');
  readonly translations = signal<Record<string, string>>({});
  readonly availableLanguages = signal<string[]>(['es']);

  setAvailableLanguages(langs: string[]): void {
    this.availableLanguages.set(langs);
  }

  async use(lang: string): Promise<void> {
    const data = await firstValueFrom(this.http.get<Record<string, string>>(`/i18n/${lang}.json`));
    this.translations.set(data);
    this.currentLang.set(lang);
  }

  localize(value: LocalizedString | undefined | null): string {
    if (!value) return '';
    const lang = this.currentLang();
    return value[lang] || value['es'] || '';
  }

  instant(key: string, params?: Record<string, string>): string {
    let value = this.translations()[key] ?? key;
    if (params) {
      for (const [param, replacement] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), replacement);
      }
    }
    return value;
  }
}
