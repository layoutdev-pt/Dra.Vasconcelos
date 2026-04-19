export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  // Included via joins
  user?: {
    email?: string;
  };
}

export interface CommentReport {
  id: string;
  comment_id: string;
  reporter_id: string;
  created_at: string;
}
