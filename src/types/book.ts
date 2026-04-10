export interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  author: string;
  description: string;
  cover_url: string;
  type: 'fisico' | 'ebook';
  price: number | null;
  buy_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}
