import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-skip-nav',
  imports: [TranslatePipe],
  templateUrl: './skip-nav.html',
  styleUrl: './skip-nav.scss',
})
export class SkipNav {}
