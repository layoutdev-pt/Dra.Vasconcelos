import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfileForm } from '../sections/perfil/ProfileForm';
import { UserComments } from '../sections/perfil/UserComments'; // Importação adicionada aqui

export const Perfil: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  // Estados para as abas
  const [activeTab, setActiveTab] = useState<'dados' | 'favoritos' | 'comentarios'>('dados');

  const handleLogout = async () => {
    await signOut();
    navigate('/entrar');
  };

  // Menu Lateral
  const menuItems = [
    { id: 'dados', label: 'Dados Pessoais', icon: User },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'comentarios', label: 'Meus Comentários', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-site-bg pt-32 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-site-text">A minha conta</h1>
          <p className="text-site-text-muted mt-2">Faça a gestão dos seus dados pessoais e preferências.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Lateral */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-surface rounded-2xl shadow-sm border border-surface-border p-2 flex flex-col gap-1 transition-colors duration-500">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-site-text-muted hover:bg-surface-muted hover:text-secondary'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-secondary' : 'text-site-text-muted/60'}`} />
                  {item.label}
                </button>
              ))}
              
              <hr className="my-2 border-surface-border" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Terminar Sessão
              </button>
            </div>
          </aside>

          {/* Área de Conteúdo */}
          <main className="flex-1">
            <div className="bg-surface rounded-2xl shadow-sm border border-surface-border p-6 md:p-8 transition-colors duration-500">
              <AnimatePresence mode="wait">
                
                {/* ABA 1: DADOS PESSOAIS */}
                {activeTab === 'dados' && (
                  <motion.div
                    key="dados"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold text-site-text mb-6">Informação Pessoal</h2>
                    <ProfileForm />
                  </motion.div>
                )}

                {/* ABA 2: FAVORITOS */}
                {activeTab === 'favoritos' && (
                  <motion.div
                    key="favoritos"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold text-site-text mb-6">Os meus Favoritos</h2>
                    
                    {/* Placeholder Visual de "Vazio" para os favoritos */}
                    <div className="text-center py-16 px-4 bg-surface-muted rounded-2xl border border-dashed border-surface-border transition-colors duration-500">
                      <Heart className="w-12 h-12 text-site-text-muted/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-site-text">Ainda não guardou favoritos</h3>
                      <p className="text-site-text-muted mt-2 max-w-sm mx-auto text-sm">
                        Os cursos, livros ou artigos que marcar com o coração vão aparecer todos organizados aqui.
                      </p>
                      <button 
                        onClick={() => navigate('/aprender')}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                      >
                        Explorar Cursos
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ABA 3: HISTÓRICO DE COMENTÁRIOS */}
                {activeTab === 'comentarios' && (
                  <motion.div
                    key="comentarios"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold text-site-text mb-6">Histórico de Comentários</h2>
                    
                    {/* Componente que criámos que puxa os dados da base de dados! */}
                    <UserComments />
                    
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};