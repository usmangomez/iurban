import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  { path: 'detail/:slug', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
