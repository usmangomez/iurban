import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LanguageSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly logoUrl = input('');
  readonly availableLanguages = input<string[]>([]);
}
