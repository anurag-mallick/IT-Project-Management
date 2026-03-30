"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, Cpu, Zap, ShieldCheck, Globe, Github, Linkedin } from 'lucide-react';

// Dragon SVG Component with flying animation
const DragonLogo = ({ animate }: { animate: boolean }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-32 h-32 ${animate ? 'dragon-animate' : 'dragon-settled'}`}
      style={{
        filter: animate ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))' : undefined,
      }}
    >
      <defs>
        <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Dragon Body */}
      <path
        d="M40 100 Q30 80 50 70 Q70 60 90 65 Q110 70 120 85 Q130 100 120 115 Q110 130 90 135 Q70 140 50 130 Q30 120 40 100"
        fill="url(#dragonGradient)"
        className="dragon-body"
      />

      {/* Dragon Head */}
      <ellipse cx="135" cy="75" rx="25" ry="20" fill="url(#dragonGradient)" />

      {/* Dragon Eye */}
      <circle cx="142" cy="70" r="6" fill="#0f172a" />
      <circle cx="144" cy="68" r="2" fill="#ffffff" />

      {/* Dragon Horns */}
      <path d="M125 58 Q130 45 140 50" stroke="url(#dragonGradient)" strokeWidth="4" fill="none" />
      <path d="M145 55 Q155 40 160 50" stroke="url(#dragonGradient)" strokeWidth="4" fill="none" />

      {/* Dragon Snout */}
      <path d="M155 75 Q170 70 175 80 Q170 90 155 85" fill="url(#dragonGradient)" />

      {/* Dragon Nostril */}
      <circle cx="168" cy="78" r="2" fill="#0f172a" />

      {/* Dragon Wings */}
      <path
        d="M80 70 Q60 40 40 50 Q20 60 30 80 Q40 100 60 90"
        fill="url(#dragonGradient)"
        opacity="0.8"
        className="dragon-wing"
      />
      <path
        d="M100 65 Q85 35 70 45 Q55 55 65 75 Q75 95 90 85"
        fill="url(#dragonGradient)"
        opacity="0.6"
        className="dragon-wing-inner"
      />

      {/* Dragon Tail */}
      <path
        d="M45 115 Q25 125 15 140 Q10 155 25 160 Q40 155 50 140 Q55 125 50 115"
        fill="url(#dragonGradient)"
        className="dragon-tail"
      />

      {/* Dragon Spikes */}
      <path d="M95 65 L100 50 L105 65" fill="url(#dragonGradient)" />
      <path d="M105 70 L112 55 L118 70" fill="url(#dragonGradient)" />
      <path d="M112 80 L120 65 L127 80" fill="url(#dragonGradient)" />

      {/* Dragon Claws */}
      <path d="M60 130 Q55 145 50 150" stroke="url(#dragonGradient)" strokeWidth="3" fill="none" />
      <path d="M75 135 Q70 150 65 155" stroke="url(#dragonGradient)" strokeWidth="3" fill="none" />
      <path d="M90 138 Q85 153 80 158" stroke="url(#dragonGradient)" strokeWidth="3" fill="none" />

      {/* Fire Breath */}
      <g className="dragon-fire">
        <ellipse cx="185" cy="80" rx="15" ry="8" fill="url(#fireGradient)" opacity="0.8" />
        <ellipse cx="195" cy="78" rx="10" ry="6" fill="url(#fireGradient)" opacity="0.6" />
        <ellipse cx="190" cy="85" rx="8" ry="5" fill="#f59e0b" opacity="0.7" />
      </g>
    </svg>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragonAnimating, setDragonAnimating] = useState(true);
  const router = useRouter();
  const { refreshProfile, user, isLoading } = useAuth();

  // Dragon animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDragonAnimating(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      refreshProfile(); // No await needed in useEffect callback
      router.push('/');
      router.refresh();
    }
  }, [user, isLoading, router, refreshProfile]);

  if (isLoading) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050505]">
      {/* Brand Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between p-12 border-r border-white/5 bg-zinc-950/40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff10 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex items-center gap-3">
          <DragonLogo animate={dragonAnimating} />
          <span className="text-xl font-black tracking-tighter text-white">HORIZON<span className="text-blue-500">IT</span></span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Future-Proof <br /> <span className="text-blue-500">IT Infrastructure.</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed">
            The next generation of IT helpdesk management. Streamlined, intelligence-driven, and cloud-first.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 py-8 border-t border-white/5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
              <Zap size={14} className="text-yellow-500" /> High Performance
            </div>
            <p className="text-white/20 text-xs">Optimized for Vercel deployment with instant responsiveness.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> Enterprise Grade
            </div>
            <p className="text-white/20 text-xs">Built on reliable Neon architecture for 24/7 operations.</p>
          </div>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-white/40 text-sm font-medium">Please sign in to your staff account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Staff ID / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                    placeholder="name@horizon.io"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={16} />
                <p className="text-xs text-red-500 font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'System Access'
              )}
            </button>
          </form>

          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 w-full opacity-20">
              <div className="h-px bg-white grow"></div>
              <span className="text-[9px] font-black uppercase tracking-widest">Horizon IT</span>
              <div className="h-px bg-white grow"></div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/anurag-mallick"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 hover:text-white transition-all transform hover:scale-110"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/anuragmallick901/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 hover:text-blue-400 transition-all transform hover:scale-110"
              >
                <Linkedin size={16} />
              </a>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Globe size={14} className="text-white/20" />
              <span className="text-[10px] text-white/20 font-medium tracking-tight">Status: Systems Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
