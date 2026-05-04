import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, LogOut, CheckCircle2, Loader2, ExternalLink,
  GraduationCap, LayoutDashboard, Shield, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import simpleLogo from '../assets/logo/simple.svg';
import { BlogAdmin } from '../sections/admin/BlogAdmin';
import { MediaAdmin } from '../sections/admin/MediaAdmin';
import { LeadsAdmin } from '../sections/admin/LeadsAdmin';
import { TestimonialsAdmin } from '../sections/admin/TestimonialsAdmin';
import { UsersAdmin } from '../sections/admin/UsersAdmin';
import { BooksAdmin } from '../sections/admin/BooksAdmin';
import { CoursesAdmin } from '../sections/admin/CoursesAdmin';

type Tab = 'books' | 'courses' | 'blog' | 'media' | 'leads' | 'testimonials' | 'users';

export const Admin: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('books');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'books', label: 'Livros & Ebooks', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'courses', label: 'Cursos & Programas', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'blog', label: 'Artigos (Blog)', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Eye className="w-4 h-4" /> },
    { id: 'leads', label: 'Leads (E-mails)', icon: <Loader2 className="w-4 h-4 hidden" /> }, // icon hidden but mapped
    { id: 'testimonials', label: 'Testemunhos', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'users', label: 'Acessos', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-site-bg font-display transition-colors duration-500">
      {/* Top bar */}
      <header className="bg-surface border-b border-surface-border sticky top-0 z-40 shadow-sm transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={simpleLogo} alt="Admin" className="h-9 w-auto transition-all" />
            <div>
              <h1 className="text-sm font-bold text-site-text leading-tight">Dashboard Admin</h1>
              <p className="text-xs text-site-text-muted">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-site-text-muted hover:text-secondary transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Ver site
            </a>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border text-sm font-semibold text-site-text-muted hover:bg-surface-muted hover:text-red-500 hover:border-red-200 transition-all">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-surface border-b border-surface-border transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-site-text-muted hover:text-site-text hover:border-surface-border'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'books' && <BooksAdmin showToast={showToast} />}
            {activeTab === 'courses' && <CoursesAdmin showToast={showToast} />}
            {activeTab === 'blog' && <BlogAdmin />}
            {activeTab === 'media' && <MediaAdmin />}
            {activeTab === 'leads' && <LeadsAdmin />}
            {activeTab === 'testimonials' && <TestimonialsAdmin />}
            {activeTab === 'users' && <UsersAdmin />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
