import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalizedString } from '../../core/models/home.model';
import { TranslateService } from '../../core/services/translate.service';

@Pipe({ name: 'localize', pure: false })
export class LocalizePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  transform(value: LocalizedString | undefined | null): string {
    return this.translateService.localize(value);
  }
}
