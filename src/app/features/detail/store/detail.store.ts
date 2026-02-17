import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HttpClient } from '@angular/common/http';
import { pipe, switchMap, tap } from 'rxjs';
import { DetailItem } from '../../../core/models/detail.model';
import { SeoMetadata } from '../../../core/models/seo.model';

interface DetailState {
  data: DetailItem | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DetailState = {
  data: null,
  isLoading: false,
  error: null,
};

export const DetailStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    hasItem: computed(() => store.data() !== null),
    seo: computed((): SeoMetadata | null => store.data()?.seo ?? null),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    loadBySlug: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true, error: null})),
        switchMap((slug) =>
          http.get<DetailItem>(`/api/get-point-app-details/${slug}`).pipe(
            tapResponse({
              next: (data) => patchState(store, {data, isLoading: false}),
              error: (err: Error) => patchState(store, {error: err.message, isLoading: false}),
            }),
          ),
        ),
      ),
    ),
  })),
);
