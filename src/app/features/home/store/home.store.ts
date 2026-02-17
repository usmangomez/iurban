import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HttpClient } from '@angular/common/http';
import { pipe, switchMap, tap } from 'rxjs';
import { HomePoint, HomeResponse } from '../../../core/models/home.model';

interface HomeState {
  data: HomePoint[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  data: [],
  isLoading: false,
  error: null,
};

export const HomeStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    hasItems: computed(() => store.data().length > 0),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    loadItems: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap(() =>
          http.get<HomeResponse>('/api/get-home-app-data/emt').pipe(
            tapResponse({
              next: (res) => patchState(store, { data: res.homePoints, isLoading: false }),
              error: (err: Error) => patchState(store, {error: err.message, isLoading: false}),
            }),
          ),
        ),
      ),
    ),
  })),
);
