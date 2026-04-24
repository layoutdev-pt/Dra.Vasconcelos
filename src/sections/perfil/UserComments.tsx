import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, ArrowRight, Calendar, ExternalLink, CornerDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Atualizámos a interface para incluir as respostas
interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  parent_id: string | null;
  replies?: Comment[]; // Lista para guardar as respostas a este comentário
}

export const UserComments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommentsAndReplies = async () => {
      if (!user?.id) return;

      try {
        // 1. Puxa todos os comentários DESTE utilizador
        const { data: myComments, error: myError } = await supabase
          .from('comments') 
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (myError) throw myError;
        
        if (myComments && myComments.length > 0) {
          
          // Pega nos IDs de todos os comentários do utilizador
          const myCommentIds = myComments.map(c => c.id);

          // 2. Puxa os comentários que são RESPOSTAS aos comentários do utilizador
          const { data: repliesData, error: repliesError } = await supabase
            .from('comments')
            .select('*')
            .in('parent_id', myCommentIds) // Procura comentários cujo 'parent_id' seja o ID de um comentário nosso
            .order('created_at', { ascending: true }); // Ordena as respostas da mais antiga para a mais nova

          if (repliesError) throw repliesError;

          // 3. Junta as respostas aos comentários correspondentes
          const commentsWithReplies = myComments.map(comment => ({
            ...comment,
            replies: repliesData ? repliesData.filter(reply => reply.parent_id === comment.id) : []
          }));

          setComments(commentsWithReplies);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('Erro ao buscar comentários e respostas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentsAndReplies();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  // Se não tiver comentários
  if (comments.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary">Sem comentários recentes</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm">
          Participe na comunidade! O seu histórico de interações no blog e nos cursos ficará registado aqui.
        </p>
        <button 
          onClick={() => navigate('/blog')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-secondary/90 transition-colors"
        >
          Ler Artigos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Se tiver comentários, mostra a lista com as respostas
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div 
          key={comment.id}
          onClick={() => navigate(`/blog/${comment.post_id}`)} 
          className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 hover:border-secondary/50 hover:shadow-md transition-all group cursor-pointer relative"
        >
          {/* O seu comentário */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(comment.created_at).toLocaleDateString('pt-PT', {
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>

            <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold">
              Ver Artigo <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <p className="text-sm text-primary leading-relaxed italic line-clamp-3">
            "{comment.content}"
          </p>

          {/* AS RESPOSTAS AO SEU COMENTÁRIO */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-secondary/20 space-y-3">
              {comment.replies.map(reply => (
                <div key={reply.id} className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-secondary" />
                    <span>
                      Resposta recebida em {new Date(reply.created_at).toLocaleDateString('pt-PT', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    "{reply.content}"
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  );
};