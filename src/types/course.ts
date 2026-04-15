export interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  content: string; // The rich text content for the landing page
  image_url: string;
  type: 'curso' | 'programa';
  level: string | null;
  modules: number | null;
  price: number | null;
  buy_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}
