import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoMetadata } from '../models/seo.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  updateMetadata(seo: SeoMetadata): void {
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: seo.ogTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.ogDescription });
    this.meta.updateTag({ property: 'og:image', content: seo.ogImage });
    this.meta.updateTag({ rel: 'canonical', href: seo.canonicalUrl });
  }

  resetToDefaults(): void {
    this.title.setTitle('iUrban CMS');
    this.meta.updateTag({ name: 'description', content: 'iUrban Content Management System' });
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("rel='canonical'");
  }
}
