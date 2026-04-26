import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Bell, Check, Trash2, X, Info, Loader2 } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Usamos uma Ref para evitar loops infinitos com o fetchNotifications
  const fetchRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    // GERAMOS UM NOME ÚNICO PARA O CANAL NESTA SESSÃO
    // O Math.random impede que o Supabase tente reutilizar um canal que ainda está a fechar
    const uniqueChannelName = `notifs-${user.id}-${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(uniqueChannelName);

    console.log('Linhagem Realtime iniciada:', uniqueChannelName);

    channel
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications', 
          filter: `user_id=eq.${user.id}` 
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.log('✅ Realtime ligado!');
        if (status === 'CHANNEL_ERROR') console.error('❌ Erro de canal - Verifica se a Replicação está ON no dashboard!');
      });

    return () => {
      console.log('Limpando canal:', uniqueChannelName);
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Dependência apenas no ID do utilizador

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-secondary transition-all rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-primary dark:text-white text-sm">Notificações</h3>
                <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                    <span className="text-xs text-gray-400 italic">A procurar novidades...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-10 text-center flex flex-col items-center gap-3">
                    <Bell className="w-8 h-8 text-gray-200" />
                    <p className="text-gray-400 text-xs font-light">Sem notificações por agora.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border-b border-gray-50 dark:border-slate-700 transition-colors relative group ${!n.is_read ? 'bg-secondary/[0.03] dark:bg-secondary/[0.05]' : 'bg-white dark:bg-slate-800'}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!n.is_read && <div className="w-2 h-2 bg-secondary rounded-full" />}
                            <h4 className={`text-[13px] font-bold ${!n.is_read ? 'text-secondary' : 'text-primary dark:text-gray-200'}`}>
                              {n.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
                            {n.message}
                          </p>
                          {n.link && (
                            <a href={n.link} className="text-[10px] text-secondary font-bold inline-flex items-center gap-1 hover:underline">
                              Ver mais <Info className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.is_read && (
                            <button onClick={() => markAsRead(n.id)} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check className="w-3.5 h-3.5" /></button>
                          )}
                          <button onClick={() => deleteNotification(n.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};