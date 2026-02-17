import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HomeStore } from './store/home.store';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, TranslatePipe],
  providers: [HomeStore],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly store = inject(HomeStore);

  ngOnInit(): void {
    this.store.loadItems();
  }
}
