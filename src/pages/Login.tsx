import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import fullLogo from '../assets/logo/full1.svg';

type Mode = 'login' | 'register';

const inputBase =
  'w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';

export const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin';

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Email ou password incorretos. Tente novamente.');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('Conta criada! Verifique o seu email para confirmar o registo.');
        setEmail('');
        setPassword('');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-hero via-white to-secondary/5 flex flex-col pt-32 pb-12">
      {/* Top spacer — Navbar is shown below this point if not standalone */}

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <a href="/">
              <img src={fullLogo} alt="Dra. Alexandra Vasconcelos" className="h-32 w-auto" />
            </a>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            {/* Mode tabs */}
            <div className="flex border-b border-gray-100">
              {(['login', 'register'] as Mode[]).map((m, i) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                  className={`flex-1 py-5 text-sm font-bold transition-all duration-300 ${
                    mode === m
                      ? 'bg-white text-secondary border-b-2 border-secondary'
                      : 'bg-gray-100/50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  } ${
                    i === 0 ? 'rounded-tl-3xl' : 'rounded-tr-3xl'
                  }`}
                >
                  {m === 'login' ? 'Entrar' : 'Criar Conta'}
                </button>
              ))}
            </div>

            <div className="p-8">
              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-7"
                >
                  <h1 className="text-xl font-bold text-primary">
                    {mode === 'login' ? 'Bem-vindo de volta' : 'Criar nova conta'}
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {mode === 'login'
                      ? 'Introduza as suas credenciais para aceder.'
                      : 'Receberá um email de confirmação após o registo.'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Feedback */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="O seu email"
                    required
                    autoComplete="email"
                    className={`${inputBase} pl-11`}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="A sua password"
                    required
                    minLength={6}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className={`${inputBase} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-secondary/20 text-sm mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : mode === 'login' ? 'Entrar' : 'Criar Conta'}
                </button>
              </form>

              {/* Divider + note */}
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  {mode === 'login'
                    ? 'Ao entrar, aceita os nossos Termos de Serviço e Política de Privacidade.'
                    : 'Após o registo, receberá um email de confirmação. Apenas contas aprovadas têm acesso.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
