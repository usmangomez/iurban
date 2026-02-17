import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HttpClient } from '@angular/common/http';
import { pipe, switchMap, tap } from 'rxjs';
import { Branding } from '../core/models/branding.model';
import { TranslateService } from '../core/services/translate.service';

interface BrandingState {
  data: Branding | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BrandingState = {
  data: null,
  isLoading: false,
  error: null,
};

export const BrandingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    logoUrl: computed(() => store.data()?.appStyle?.logo?.value ?? ''),
    primaryColor: computed(() => store.data()?.appStyle?.corpColor1 ?? ''),
    secondaryColor: computed(() => store.data()?.appStyle?.corpColor2 ?? ''),
    headerColor: computed(() => store.data()?.appStyle?.headerColor ?? ''),
    backgroundColor: computed(() => store.data()?.appStyle?.backgroundColor ?? ''),
    textColor: computed(() => store.data()?.appStyle?.corpCompl ?? ''),
    availableLanguages: computed(() => store.data()?.lang?.availableLanguages ?? ['es']),
    mainLanguage: computed(() => store.data()?.lang?.mainLanguage ?? 'es'),
  })),
  withMethods((store, http = inject(HttpClient), translate = inject(TranslateService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          http.get<Branding>('/api/get-common-app/emt').pipe(
            tapResponse({
              next: (data) => {
                patchState(store, { data, isLoading: false });
                const langs = data.lang?.availableLanguages ?? ['es'];
                translate.setAvailableLanguages(langs);
                translate.use(data.lang?.mainLanguage ?? langs[0]);
              },
              error: (err: Error) => patchState(store, { error: err.message, isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
