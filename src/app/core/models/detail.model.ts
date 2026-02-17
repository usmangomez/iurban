import { SeoMetadata } from './seo.model';

export interface DetailItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  seo: SeoMetadata;
}
