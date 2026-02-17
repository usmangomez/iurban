import { DOCUMENT } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SkipNav } from '../../shared/components/skip-nav/skip-nav';
import { Header } from '../../shared/components/header/header';
import { BrandingStore } from '../../store/branding.store';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SkipNav, Header],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly brandingStore = inject(BrandingStore);
  private readonly document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const branding = this.brandingStore.data();
      if (!branding) return;

      const style = branding.appStyle;
      const root = this.document.documentElement.style;
      const vars: Record<string, string | undefined> = {
        '--color-primary': style.corpColor1,
        '--color-secondary': style.corpColor2,
        '--color-header': style.headerColor,
        '--color-bg': style.backgroundColor,
        '--color-text': style.corpCompl,
      };

      for (const [prop, value] of Object.entries(vars)) {
        if (value) {
          root.setProperty(prop, value);
        }
      }
    });
  }
}
