import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Upload, X, User as UserIcon, Phone, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import fullLogo from '../assets/logo/full1.svg';

type Mode = 'login' | 'register' | 'forgot';

const inputBase =
  'w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-sm text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all';

export const Login: React.FC = () => {
  const { signIn, signUp, verifyCode, sendPasswordReset, verifyRecoveryCode, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mode, setMode] = useState<Mode>('login');
  
  // Ecrãs de verificação
  const [showVerification, setShowVerification] = useState(false);
  const [showRecoveryVerification, setShowRecoveryVerification] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); 
  
  // Array para guardar cada número individualmente (8 dígitos)
  const [otpValues, setOtpValues] = useState<string[]>(Array(8).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);

  // LOGICA DOS QUADRADINHOS DO CÓDIGO
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (pastedData) {
      const newOtp = [...otpValues];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpValues(newOtp);
      const focusIndex = Math.min(pastedData.length, 7);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
    setShowVerification(false);
    setShowRecoveryVerification(false);
    setIsOtpVerified(false);
    setOtpValues(Array(8).fill(''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Email ou password incorretos. Tente novamente.');
        setLoading(false); return;
      } 
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
        if (profile?.is_admin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } else if (mode === 'register') {
      if (!acceptTerms) {
        setError('Deve aceitar os Termos e a Política de Privacidade.');
        setLoading(false); return;
      }
      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem. Tente novamente.');
        setLoading(false); return;
      }

      let uploadedAvatarUrl = '';
      if (avatarFile) {
        try {
          const ext = avatarFile.name.split('.').pop();
          const path = `${Math.random().toString(36).slice(2)}_${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile);
          if (!upErr) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(path);
            uploadedAvatarUrl = data.publicUrl;
          }
        } catch {}
      }

      const { error } = await signUp({
        email, password, firstName, lastName, phone, avatarUrl: uploadedAvatarUrl
      });

      if (error) {
        setError(error);
      } else {
        setSuccess('Enviámos um código numérico para o seu e-mail!');
        setShowVerification(true);
      }
    } else if (mode === 'forgot') {
      const { error } = await sendPasswordReset(email);
      if (error) {
        setError('Ocorreu um erro ao enviar o código. Verifique o seu e-mail.');
      } else {
        setSuccess('Código de recuperação enviado para o seu e-mail!');
        setShowRecoveryVerification(true);
      }
    }
    setLoading(false);
  };

  const handleVerifyOtpSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const finalCode = otpValues.join('');
    const { error } = await verifyCode(email, finalCode);

    if (error) {
      setError('Código inválido ou expirado. Verifique se copiou corretamente.');
    } else {
      setSuccess('Conta confirmada com sucesso! A entrar...');
      await signIn(email, password);
      navigate('/', { replace: true });
    }
    setLoading(false);
  };

  const handleVerifyRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const finalCode = otpValues.join('');
    
    const { error } = await verifyRecoveryCode(email, finalCode);
    
    if (error) {
      setError('Código inválido ou expirado. Verifique novamente.');
    } else {
      setSuccess('Código confirmado! Crie a sua nova palavra-passe.');
      setIsOtpVerified(true); 
    }
    setLoading(false);
  };

  // --- NOVA LÓGICA DE ATUALIZAR A SENHA (COM VERIFICAÇÃO DE SENHA ANTIGA) ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setLoading(false); return;
    }

    // TRUQUE: Tentamos fazer login com a nova senha para ver se ela é igual à antiga
    const { error: isOldPasswordError } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword
    });

    // Se NÃO deu erro, significa que o login funcionou... logo, o utilizador escreveu a password ANTIGA!
    if (!isOldPasswordError) {
      setError('Ups! Essa já é a sua palavra-passe atual. Escolha uma nova (a memória às vezes prega-nos partidas!).');
      setLoading(false);
      return;
    }

    // Se deu erro, ótimo! Significa que a palavra-passe é realmente nova. Podemos atualizar.
    const { error } = await updatePassword(newPassword);

    if (error) {
      // Dupla verificação caso o Supabase devolva o seu próprio erro de "same password"
      if (error.message.includes('different from the old')) {
        setError('Ups! Essa já é a sua palavra-passe atual. Escolha uma nova (a memória às vezes prega-nos partidas!).');
      } else {
        setError('Ocorreu um erro ao atualizar. Tente novamente.');
      }
      setLoading(false); return;
    }

    setSuccess('Palavra-passe alterada com sucesso! A entrar na sua conta...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      setTimeout(() => {
        if (profile?.is_admin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 1500);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-surface-hero via-white to-secondary/5 flex flex-col pt-32 pb-12">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-12">
            <a href="/"><img src={fullLogo} alt="Dra. Alexandra Vasconcelos" className="h-32 w-auto" /></a>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            
            {showVerification && mode === 'register' ? (
              <div className="p-8">
                <button onClick={() => setShowVerification(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <h1 className="text-xl font-bold text-primary mb-2">Verifique o seu E-mail</h1>
                <p className="text-sm text-gray-400 mb-6">
                  Introduza o código numérico que enviámos para <span className="font-semibold text-primary">{email}</span>.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div key="verify-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div key="verify-success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-700">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleVerifyOtpSignup} className="space-y-6">
                  <div className="flex justify-between gap-1 sm:gap-2">
                    {otpValues.map((value, index) => (
                      <input
                        key={`signup-${index}`}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text" inputMode="numeric" value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-10 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold text-primary bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={loading || otpValues.join('').length < 8} className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md text-sm flex items-center justify-center">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirmar Conta'}
                  </button>
                </form>
              </div>

            ) : showRecoveryVerification && mode === 'forgot' ? (
              <div className="p-8">
                {!isOtpVerified && (
                  <button onClick={() => setShowRecoveryVerification(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                )}

                <h1 className="text-xl font-bold text-primary mb-2">
                  {!isOtpVerified ? 'Verifique a sua caixa de e-mail' : 'Nova Palavra-passe'}
                </h1>
                <p className="text-sm text-gray-400 mb-6">
                  {!isOtpVerified 
                    ? <>Introduza o código enviado para <span className="font-semibold text-primary">{email}</span>.</> 
                    : 'Crie uma palavra-passe nova e segura.'}
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div key="rec-verify-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div key="rec-verify-success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-700">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isOtpVerified ? (
                  <form onSubmit={handleVerifyRecoveryCode} className="space-y-4">
                    <div className="flex justify-between gap-1 sm:gap-2 mb-6">
                      {otpValues.map((value, index) => (
                        <input
                          key={`recovery-${index}`}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text" inputMode="numeric" value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-10 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold text-primary bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                        />
                      ))}
                    </div>
                    <button type="submit" disabled={loading || otpValues.join('').length < 8} className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md text-sm mt-4 flex items-center justify-center">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verificar Código'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder="Nova palavra-passe" required minLength={6} className={`${inputBase} pl-11 pr-12`}
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar nova palavra-passe" required minLength={6} className={`${inputBase} pl-11`}
                      />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md text-sm mt-4 flex items-center justify-center">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar e Entrar'}
                    </button>
                  </form>
                )}
              </div>

            ) : (
              <>
                {mode !== 'forgot' && (
                  <div className="flex border-b border-gray-100">
                    {(['login', 'register'] as Mode[]).map((m, i) => (
                      <button
                        key={m}
                        onClick={() => changeMode(m)}
                        className={`flex-1 py-5 text-sm font-bold transition-all duration-300 ${
                          mode === m ? 'bg-white text-secondary border-b-2 border-secondary' : 'bg-gray-100/50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        } ${i === 0 ? 'rounded-tl-3xl' : 'rounded-tr-3xl'}`}
                      >
                        {m === 'login' ? 'Entrar' : 'Criar Conta'}
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-8">
                  {mode === 'forgot' && (
                    <button onClick={() => changeMode('login')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-secondary mb-6 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Voltar ao Login
                    </button>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div key={mode} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="mb-7">
                      <h1 className="text-xl font-bold text-primary">
                        {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Criar nova conta' : 'Recuperar Palavra-passe'}
                      </h1>
                      <p className="text-sm text-gray-400 mt-1">
                        {mode === 'login' ? 'Introduza as suas credenciais para aceder.' : mode === 'register' ? 'Preencha os dados para criar a sua conta.' : 'Introduza o seu e-mail para receber um código numérico.'}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.div key="main-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div key="main-success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                      {mode === 'register' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Nome" required className={`${inputBase} pl-11`} />
                            </div>
                            <div className="relative flex-1">
                              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Apelido" className={`${inputBase} pl-11`} />
                            </div>
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefone (Opcional)" className={`${inputBase} pl-11`} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="O seu email" required autoComplete="email" className={`${inputBase} pl-11`} />
                    </div>

                    {mode !== 'forgot' && (
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                          placeholder={mode === 'login' ? "A sua password" : "Crie uma password"} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={`${inputBase} pl-11 pr-12`}
                        />
                        <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {mode === 'login' && (
                      <div className="flex justify-end">
                        <button type="button" onClick={() => changeMode('forgot')} className="text-xs text-secondary hover:text-secondary/80 hover:underline transition-all">
                          Esqueceu-se da palavra-passe?
                        </button>
                      </div>
                    )}

                    <AnimatePresence>
                      {mode === 'register' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmar password" required minLength={6} className={`${inputBase} pl-11`} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {mode === 'register' && (
                        <motion.div key="avatar-picker" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pt-2">
                          <div className="relative border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors p-4 flex flex-col items-center justify-center gap-3 cursor-pointer">
                            {avatarPreview ? (
                              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/30 shadow-md group">
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={e => { e.stopPropagation(); setAvatarFile(null); setAvatarPreview(null); }} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                  <X className="w-5 h-5 text-white" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center"><Upload className="w-5 h-5 text-secondary" /></div>
                                <div className="text-center">
                                  <p className="text-sm font-semibold text-primary">Foto de Perfil <span className="text-gray-400 font-normal">(Opcional)</span></p>
                                  <p className="text-xs text-gray-400 mt-0.5">Clique para selecionar uma imagem</p>
                                </div>
                              </>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
                              }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {mode === 'register' && (
                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 text-secondary" required />
                          <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">Li e aceito os <Link to="/termos" className="text-secondary font-bold hover:underline">Termos e Condições</Link> e a <Link to="/privacidade" className="text-secondary font-bold hover:underline">Política de Privacidade</Link>.*</span>
                        </label>
                      </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md text-sm mt-2 flex items-center justify-center">
                      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar Conta' : 'Recuperar Senha'}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};