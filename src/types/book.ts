export interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  author: string;
  description: string | null;
  cover_url: string;
  type: 'fisico' | 'ebook';
  price: number | null;
  buy_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}
