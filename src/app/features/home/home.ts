import { Component, inject, OnInit } from '@angular/core';
import { HomeStore } from './store/home.store';
import { Hero } from './components/hero/hero';
import { Events } from './components/events/events';
import { HomeSkeleton } from './components/home-skeleton/home-skeleton';

@Component({
  selector: 'app-home',
  imports: [Hero, Events, HomeSkeleton],
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
