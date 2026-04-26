import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Flag, Trash2, Send, CornerDownRight, AlertTriangle, UserCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentWithProfile {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles: {
    email: string | null;
    avatar_url: string | null;
    banned: boolean;
  } | null;
}

interface BlogCommentsProps {
  postId: string;
}

export const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(email, avatar_url, banned)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
      
    if (data) {
      setComments(data as CommentWithProfile[]);
    }
    setLoading(false);
  };

  const checkBanStatus = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('banned').eq('id', user.id).single();
    if (data) setIsBanned(data.banned);
  };

  useEffect(() => {
    checkBanStatus();
    fetchComments();
  }, [postId, user]);

  // Post a new top-level comment
  const handleSubmit = async () => {
    if (!newComment.trim() || !user || isBanned) return;
    setSubmitting(true);
    
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: newComment.trim(),
      parent_id: null
    });
    
    setSubmitting(false);
    if (error) {
      alert(`Erro ao publicar: ${error.message}`);
    } else {
      setNewComment('');
      fetchComments();
    }
  };

  // Post a reply to a specific comment
  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim() || !user || isBanned) return;
    setSubmitting(true);
    
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: replyText.trim(),
      parent_id: parentId
    });
    
    setSubmitting(false);
    if (error) {
      alert(`Erro ao publicar: ${error.message}`);
    } else {
      setReplyText('');
      setReplyTo(null);
      fetchComments();
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Tem a certeza que deseja apagar este comentário permanentemente?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      fetchComments();
    } else {
      alert(`Erro ao apagar: ${error.message}`);
    }
  };

  const handleReport = async (commentId: string) => {
    if (!user) {
      alert('Faça login para poder denunciar comentários.');
      return;
    }
    const { error } = await supabase.from('comment_reports').insert({
      comment_id: commentId,
      reporter_id: user.id
    });
    
    if (error) {
      if (error.code === '23505') {
        alert('Já denunciaste este comentário anteriormente.');
      } else {
        alert(`Erro ao reportar: ${error.message}`);
      }
    } else {
      alert('Comentário reportado com sucesso. Será analisado pela moderação.');
    }
  };

  // Helper: extract display name from email
  const getDisplayName = (profile: CommentWithProfile['profiles']) => {
    if (!profile?.email) return 'Utilizador';
    const name = profile.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Helper: render avatar
  const renderAvatar = (profile: CommentWithProfile['profiles'], size: 'sm' | 'md' = 'md') => {
    const dim = size === 'md' ? 'w-9 h-9' : 'w-7 h-7';
    const iconDim = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    
    if (profile?.avatar_url) {
      return <img src={profile.avatar_url} alt="" className={`${dim} rounded-full object-cover border-2 border-secondary/20`} />;
    }
    return (
      <div className={`${dim} rounded-full bg-secondary/10 flex items-center justify-center text-secondary`}>
        <UserCircle2 className={iconDim} />
      </div>
    );
  };

  // Organize comments into parent and children
  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  return (
    <div className="max-w-[900px] mx-auto mt-20 pt-16 border-t border-surface-border">
      <h3 className="text-2xl font-bold text-site-text mb-8 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-secondary" /> 
        Comentários <span className="text-site-text-muted font-medium text-lg">({comments.length})</span>
      </h3>

      {/* New Comment Input */}
      <div className="mb-12 bg-surface-muted rounded-3xl p-6 border border-surface-border">
        {!user ? (
          <div className="text-center py-6">
            <p className="text-site-text-muted mb-4 font-medium">Junta-te à conversa!</p>
            <Link to="/entrar" className="inline-flex px-6 py-2.5 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors">
              Fazer Login / Criar Conta
            </Link>
          </div>
        ) : isBanned ? (
          <div className="text-center py-6 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <p className="font-bold">A tua conta foi bloqueada devido a Múltiplas Denúncias.</p>
            <p className="text-sm mt-1">Perdeste o acesso de participação no portal.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-secondary/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><UserCircle2 className="w-5 h-5" /></div>
              )}
              <p className="text-sm font-semibold text-site-text-muted">{user.email}</p>
            </div>
            <textarea
              className="w-full bg-surface border border-surface-border rounded-2xl p-4 text-site-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none"
              rows={3}
              placeholder="Partilha a tua opinião, faz uma pergunta..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <button 
                onClick={handleSubmit} 
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-white font-bold text-sm rounded-xl hover:bg-secondary/90 disabled:opacity-50 transition-all shadow-md"
              >
                <Send className="w-4 h-4" /> {submitting ? 'A enviar...' : 'Publicar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-24 bg-surface-muted rounded-2xl w-full"></div>
          <div className="h-24 bg-surface-muted rounded-2xl w-full"></div>
        </div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-16 text-site-text-muted">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Nenhum comentário por agora. Sê o primeiro a escrever!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {topLevelComments.map(comment => (
            <div key={comment.id} className="flex flex-col gap-3">
              {/* Parent Comment */}
              <div className="bg-surface border border-surface-border p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {renderAvatar(comment.profiles)}
                    <div>
                      <p className="font-bold text-sm text-site-text">{getDisplayName(comment.profiles)}</p>
                      <p className="text-xs text-site-text-muted">{new Date(comment.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {user && user.id !== comment.user_id && (
                       <button onClick={() => handleReport(comment.id)} title="Denunciar Abuso" className="p-1.5 text-site-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Flag className="w-4 h-4" /></button>
                    )}
                    {(isAdmin || user?.id === comment.user_id) && (
                      <button onClick={() => handleDelete(comment.id)} title="Apagar Comentário" className="p-1.5 text-site-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
                <p className="text-site-text-muted text-sm leading-relaxed">{comment.content}</p>
                
                {user && !isBanned && (
                  <button 
                    onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyText(''); }} 
                    className="text-xs font-bold text-secondary mt-3 flex items-center gap-1 hover:text-site-text transition-colors"
                  >
                    <CornerDownRight className="w-3 h-3" /> Responder
                  </button>
                )}
              </div>

              {/* Inline Reply Box */}
              {replyTo === comment.id && user && !isBanned && (
                <div className="ml-10 bg-secondary/5 border border-secondary/20 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-secondary font-bold flex items-center gap-1">
                      <CornerDownRight className="w-3 h-3" /> A responder a {getDisplayName(comment.profiles)}
                    </p>
                    <button onClick={() => setReplyTo(null)} className="text-site-text-muted hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  <textarea
                    autoFocus
                    className="w-full bg-surface border border-surface-border rounded-xl p-3 text-sm text-site-text focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all resize-none"
                    rows={2}
                    placeholder="Escreve a tua resposta..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleReplySubmit(comment.id)} 
                      disabled={submitting || !replyText.trim()}
                      className="flex items-center gap-2 px-5 py-2 bg-secondary text-white font-bold text-xs rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-all"
                    >
                      <Send className="w-3 h-3" /> {submitting ? 'A enviar...' : 'Responder'}
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {getReplies(comment.id).map(reply => (
                <div key={reply.id} className="ml-10 bg-surface-muted border border-surface-border p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {renderAvatar(reply.profiles, 'sm')}
                      <div>
                        <p className="font-bold text-sm text-site-text">{getDisplayName(reply.profiles)}</p>
                        <p className="text-[10px] text-site-text-muted">{new Date(reply.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {user && user.id !== reply.user_id && (
                        <button onClick={() => handleReport(reply.id)} title="Denunciar Abuso" className="p-1.5 text-site-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Flag className="w-3 h-3" /></button>
                      )}
                      {(isAdmin || user?.id === reply.user_id) && (
                        <button onClick={() => handleDelete(reply.id)} title="Apagar Resposta" className="p-1.5 text-site-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3 h-3" /></button>
                      )}
                    </div>
                  </div>
                  <p className="text-site-text-muted text-sm leading-relaxed">
                    <span className="text-secondary font-medium text-xs mr-2">@{getDisplayName(comment.profiles)}</span>
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
