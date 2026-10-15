import React, { useState } from 'react';
import { X, User, Lock, Mail, Check, LogIn, UserPlus, LogOut, ShieldCheck } from 'lucide-react';
import { UserAccount, UserProfile } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  onUpdateAccount: (acc: UserAccount, newUsername?: string) => void;
  profile: UserProfile;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onUpdateAccount,
  profile,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    soundEngine.playCoin();
    const googleUser: UserAccount = {
      id: `google_${Date.now()}`,
      username: profile.name || 'Usuario_Google',
      email: `${(profile.name || 'jugador').toLowerCase()}@gmail.com`,
      isGoogle: true,
      isLoggedIn: true,
    };
    onUpdateAccount(googleUser, googleUser.username);
    setSuccessMsg('¡Sesión iniciada con Google!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    soundEngine.playCoin();
    const updatedUser: UserAccount = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@patataroyale.com`,
      isGoogle: false,
      isLoggedIn: true,
    };
    onUpdateAccount(updatedUser, updatedUser.username);
    setSuccessMsg(tab === 'login' ? '¡Sesión iniciada con éxito!' : '¡Cuenta creada con éxito!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  const handleLogout = () => {
    soundEngine.playClick();
    onUpdateAccount({
      id: 'guest_user',
      username: 'Bomba_Maestra',
      isGoogle: false,
      isLoggedIn: false,
    });
    setSuccessMsg('Has cerrado sesión');
    setTimeout(() => {
      setSuccessMsg('');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-950/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-arcade text-white tracking-wide">
                {account.isLoggedIn ? 'Mi Cuenta' : tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-xs text-slate-400">
                Guarda tu nivel, pases y cosméticos en la nube
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {account.isLoggedIn ? (
            /* Logged in view */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl">
                  {account.isGoogle ? '🌐' : '👤'}
                </div>
                <div>
                  <div className="text-sm font-arcade text-white">{account.username}</div>
                  <div className="text-xs text-slate-400">{account.email}</div>
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Conectado ({account.isGoogle ? 'Google Auth' : 'Cuenta Local'})</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 text-xs text-slate-300">
                Tu progreso actual: <span className="font-arcade text-yellow-300">Nivel {profile.level}</span> con{' '}
                <span className="font-arcade text-amber-300">{profile.coins} Monedas</span>.
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-300 font-arcade text-xs rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>CERRAR SESIÓN</span>
              </button>
            </div>
          ) : (
            /* Not logged in: tabs and form */
            <div className="space-y-4">
              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-100 active:scale-95 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="flex items-center gap-2 my-2 text-slate-500 text-xs">
                <div className="flex-1 h-px bg-slate-800" />
                <span>O usa usuario y contraseña</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    tab === 'login' ? 'bg-orange-500 text-slate-950 font-black' : 'text-slate-400'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    tab === 'register' ? 'bg-orange-500 text-slate-950 font-black' : 'text-slate-400'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ej: PatateroFeroz"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 focus:border-orange-500 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                {tab === 'register' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 focus:border-orange-500 text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 focus:border-orange-500 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 active:scale-95 text-slate-950 font-arcade text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {tab === 'login' ? 'ENTRAR A MI CUENTA' : 'CREAR CUENTA GRATIS'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
