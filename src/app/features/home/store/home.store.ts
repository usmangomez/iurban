import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HttpClient } from '@angular/common/http';
import { pipe, switchMap, tap } from 'rxjs';
import { HeroSection, HomePoint, HomeResponse } from '../../../core/models/home.model';

interface HomeState {
  hero: HeroSection | null;
  homePoint: HomePoint[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  hero: null,
  homePoint: [],
  isLoading: false,
  error: null,
};

export const HomeStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    events: computed(() => store.homePoint().filter(item => item.type === 'events')?.[0]?.events ?? []),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    loadItems: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(() =>
          http.get<HomeResponse>('/api/get-home-app-data/emt').pipe(
            tapResponse({
              next: (res) => patchState(store, {hero: res.heroSection, homePoint: res.homePoints, isLoading: false}),
              error: (err: Error) => patchState(store, {error: err.message, isLoading: false}),
            }),
          ),
        ),
      ),
    ),
  })),
);
