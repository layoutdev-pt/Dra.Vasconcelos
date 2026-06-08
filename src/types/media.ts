export interface MediaEntry {
  id: string;
  title: string;
  type: 'video' | 'artigo' | 'podcast';
  external_url: string;
  image_url: string | null;
  published_at: string | null;
  position?: number;
  created_at: string;
}
