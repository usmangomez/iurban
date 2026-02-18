# iUrban CMS

Angular 21 SSR front-end CMS for urban tourism platforms. Displays dynamic branding, hero sections, event carousels, and point-of-interest detail pages driven entirely by a remote API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components) |
| Rendering | SSR + client hydration (`@angular/ssr`, Express 5) |
| State | NgRx SignalStore v21 |
| HTTP | Angular `HttpClient` with `withFetch()` |
| Styles | SCSS, BEM naming, CSS custom properties |
| Linting | ESLint (flat config) + Prettier |
| Testing | Vitest + jsdom |

---

## Scripts

```bash
npm start                        # dev server (http://localhost:4200)
npm run build                    # production build (SSR)
npm run watch                    # dev build in watch mode
npm test                         # run Vitest unit tests
npm run lint                     # ESLint check
npm run lint:fix                 # ESLint auto-fix
npm run serve:ssr:iurban-cms     # serve the production SSR bundle
```

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/
│   │   │   └── base-url.interceptor.ts   # rewrites /api/* → environment.apiBaseUrl
│   │   ├── models/
│   │   │   ├── branding.model.ts
│   │   │   ├── detail.model.ts
│   │   │   ├── home.model.ts             # LocalizedString, HeroSection, HomePoint, HomeItem
│   │   │   └── seo.model.ts
│   │   └── services/
│   │       ├── seo.service.ts            # page title + Open Graph meta tags
│   │       └── translate.service.ts      # currentLang signal + localize()
│   │
│   ├── features/
│   │   ├── shell/                        # persistent layout (header, router-outlet)
│   │   ├── home/                         # Home feature
│   │   │   ├── store/home.store.ts       # hero + events state
│   │   │   ├── components/
│   │   │   │   ├── hero/                 # full-width video hero section
│   │   │   │   ├── events/               # events carousel section
│   │   │   │   └── home-skeleton/        # loading skeleton
│   │   │   ├── home.ts
│   │   │   └── home.routes.ts
│   │   └── detail/                       # Detail (POI) feature
│   │       ├── store/detail.store.ts     # item state, loaded by slug
│   │       ├── components/
│   │       │   └── detail-skeleton/      # loading skeleton
│   │       ├── detail.ts
│   │       └── detail.routes.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── card/                     # reusable 4/5 image + 1/5 title card
│   │   │   ├── carousel/                 # reusable CSS-transform carousel
│   │   │   │   ├── carousel.ts
│   │   │   │   └── carousel-item.directive.ts
│   │   │   ├── header/
│   │   │   ├── language-switcher/
│   │   │   └── skip-nav/
│   │   └── pipes/
│   │       ├── localize.pipe.ts          # LocalizedString → current-lang string
│   │       └── translate.pipe.ts         # i18n key → translated string
│   │
│   ├── store/
│   │   └── branding.store.ts             # global root store (colors, logos, langs)
│   │
│   ├── app.config.ts                     # providers: router, HttpClient, hydration
│   ├── app.config.server.ts
│   └── app.routes.ts
│
├── environments/
│   ├── environment.ts                    # dev  – apiBaseUrl points to local/staging API
│   └── environment.prod.ts              # prod – swapped via fileReplacements in angular.json
└── styles.scss                           # global reset, CSS variables, skeleton shimmer
```

---

## Architecture

### Routing

```
/                  → Shell (persistent layout)
├── /              → Home (lazy)
└── /detail/:slug  → Detail (lazy)
```

`Shell` is the persistent layout wrapper. Feature routes are lazy-loaded via `loadChildren`. Router input binding (`withComponentInputBinding`) is enabled, so route params like `:slug` bind automatically to component `input()` signals — no `ActivatedRoute` needed.

### State Management (NgRx SignalStore)

Each feature owns a **local store** provided at the component level (`providers: [FeatureStore]`). The `BrandingStore` is the only **global store** (`providedIn: 'root'`), loaded once on app init via `withHooks`.

```typescript
// standard store pattern
tap(() => patchState(store, { isLoading: true }))
tapResponse({
  next: (data) => patchState(store, { data, isLoading: false }),
  error: (err)  => patchState(store, { error: err.message, isLoading: false }),
})
```

All async operations use `rxMethod` + `switchMap` + `tapResponse`.

### HTTP & Environments

The `baseUrlInterceptor` rewrites any request starting with `/api/` to the configured `environment.apiBaseUrl`. This keeps API paths short throughout the codebase and makes environment switching require no code changes.

```typescript
// store or service
http.get('/api/get-home-app-data/emt')
// → https://api.example.com/get-home-app-data/emt  (in production)
```

### Branding & Theming

`BrandingStore` loads on app init and exposes computed signals for logo URLs, brand colors, and available languages. The `Shell` component applies these as CSS custom properties, driving the full theme at runtime without a rebuild.

### Internationalisation

`TranslateService` holds a `currentLang` signal (default `'es'`). The `BrandingStore` sets the available languages and active language from the API response on load.

**For localized model fields** (`LocalizedString: { es: string; en: string; [lang: string]: string }`):

- **In TypeScript** — call `translateService.localize(value)` inside a `computed()`. Because `localize()` reads `currentLang()` internally, the computed re-runs automatically on language change.
- **In templates** — use the `| localize` pipe (`pure: false`).

```html
<!-- template -->
{{ item.name | localize }}
```

```typescript
// component
readonly title = computed(() => this.translateService.localize(this.hero()?.headerName));
```

**For static UI strings**, use the `| translate` pipe with JSON key files loaded by `TranslateService.use(lang)` from `/i18n/<lang>.json`.

Language switching is handled by `<app-language-switcher>`, which calls `translateService.use(lang)`.

### Skeleton Loading

Each feature has a co-located skeleton component that mirrors its layout, using the global `.skeleton` / `.skeleton--dark` shimmer utility classes defined in `styles.scss`.

```html
@if (store.isLoading()) {
  <app-home-skeleton />
} @else {
  <app-hero [hero]="store.hero()" />
  <app-events [events]="store.events()" />
}
```

### SSR & Hydration

The app runs with `outputMode: "server"` and `provideClientHydration(withEventReplay())`. Any DOM-only APIs are guarded with `isPlatformBrowser(platformId)` so they never execute during server rendering.

---

## Shared Components

### `<app-carousel>`

A CSS-transform-based carousel. All items stay in the DOM and navigation slides via `translateX` transition — no DOM re-creation or blink on navigation.

```html
<app-carousel [items]="$any(myItems)" [visibleCount]="3">
  <ng-template carouselItem let-item>
    <app-card [image]="$any(item).image" [title]="$any(item).name | localize" />
  </ng-template>
</app-carousel>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `items` | `unknown[]` | required | Array of items to render |
| `visibleCount` | `number` | `3` | Number of visible slides at once |

Import both `Carousel` and `CarouselItemDirective` in the consuming component.

### `<app-card>`

Portrait card with a **4/5 image + 1/5 title** split via flexbox (`flex: 4` / `flex: 1`).

```html
<app-card [image]="url" [title]="label" />
```

| Input | Type | Description |
|---|---|---|
| `image` | `string` | Image URL |
| `title` | `string` | Text shown in the title bar |

---

## Adding a New Feature

1. Create `src/app/features/<name>/` with `<name>.ts`, `<name>.html`, `<name>.scss`, `<name>.routes.ts`
2. Create `src/app/features/<name>/store/<name>.store.ts` using `signalStore` with `withState`, `withMethods`, `withComputed`
3. Provide the store at component level: `providers: [NameStore]`
4. Create a skeleton at `src/app/features/<name>/components/<name>-skeleton/` using `.skeleton` utility classes
5. Register the route in `app.routes.ts` under the Shell children using `loadChildren`

---

## Environment Configuration

| File | Used when |
|---|---|
| `src/environments/environment.ts` | `ng serve` (development) |
| `src/environments/environment.prod.ts` | `ng build` (production, via `fileReplacements`) |

```typescript
export const environment = {
  apiBaseUrl: 'https://your-api.example.com',
};
```
