"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, Cpu, Zap, ShieldCheck, Globe, Github, Linkedin } from 'lucide-react';

// Dranzer Beyblade Logo Component with flying animation
const DragonLogo = ({ animate }: { animate: boolean }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-32 h-32 ${animate ? 'dragon-animate' : 'dragon-settled'}`}
      style={{
        filter: animate ? 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))' : undefined,
      }}
    >
      <defs>
        {/* Red/Orange Dranzer gradient */}
        <linearGradient id="dranzerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        {/* Fire gradient */}
        <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        {/* Inner fire glow */}
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
      </defs>

      {/* Phoenix/Dranzer Wings - Large spread wings */}
      <path
        d="M100 100 Q70 60 30 40 Q10 35 5 50 Q15 65 40 75 Q20 90 10 110 Q25 120 50 115 Q60 105 100 100"
        fill="url(#dranzerGradient)"
        opacity="0.9"
        className="dragon-wing"
      />
      <path
        d="M100 100 Q130 60 170 40 Q190 35 195 50 Q185 65 160 75 Q180 90 190 110 Q175 120 150 115 Q140 105 100 100"
        fill="url(#dranzerGradient)"
        opacity="0.9"
        className="dragon-wing"
      />

      {/* Wing feather details */}
      <path
        d="M60 70 Q45 55 35 60 Q50 70 60 70"
        fill="#fbbf24"
        opacity="0.6"
      />
      <path
        d="M140 70 Q155 55 165 60 Q150 70 140 70"
        fill="#fbbf24"
        opacity="0.6"
      />

      {/* Dranzer Body - Compact and powerful */}
      <ellipse cx="100" cy="105" rx="25" ry="20" fill="url(#dranzerGradient)" />

      {/* Dranzer Head - Phoenix style */}
      <path
        d="M85 85 Q100 60 115 85 Q110 95 100 98 Q90 95 85 85"
        fill="url(#dranzerGradient)"
      />

      {/* Beak */}
      <path
        d="M100 90 L108 95 L100 100"
        fill="#fbbf24"
      />

      {/* Eyes - Fiery */}
      <circle cx="92" cy="82" r="4" fill="#0f172a" />
      <circle cx="93" cy="81" r="1.5" fill="#fbbf24" />
      <circle cx="108" cy="82" r="4" fill="#0f172a" />
      <circle cx="109" cy="81" r="1.5" fill="#fbbf24" />

      {/* Head crest/flames */}
      <path
        d="M100 65 Q95 50 100 40 Q105 50 100 65"
        fill="url(#fireGradient)"
        className="dragon-fire"
      />
      <path
        d="M95 70 Q88 55 92 45 Q96 55 95 70"
        fill="url(#fireGradient)"
        opacity="0.8"
      />
      <path
        d="M105 70 Q112 55 108 45 Q104 55 105 70"
        fill="url(#fireGradient)"
        opacity="0.8"
      />

      {/* Tail - Fiery feathers */}
      <path
        d="M100 125 Q85 140 70 155 Q65 165 75 160 Q90 150 100 140"
        fill="url(#dranzerGradient)"
        className="dragon-tail"
      />
      <path
        d="M100 125 Q115 140 130 155 Q135 165 125 160 Q110 150 100 140"
        fill="url(#dranzerGradient)"
        className="dragon-tail"
      />

      {/* Tail flame tips */}
      <path
        d="M70 155 Q65 165 75 165 Q70 155 70 155"
        fill="url(#fireGradient)"
        className="dragon-fire"
      />
      <path
        d="M130 155 Q135 165 125 165 Q130 155 130 155"
        fill="url(#fireGradient)"
        className="dragon-fire"
      />

      {/* Fire aura around body */}
      <ellipse
        cx="100"
        cy="105"
        rx="35"
        ry="30"
        fill="none"
        stroke="url(#fireGradient)"
        strokeWidth="3"
        opacity="0.4"
        className="dragon-fire"
      />

      {/* Blazing fire breath */}
      <g className="dragon-fire">
        <ellipse cx="100" cy="45" rx="20" ry="12" fill="url(#fireGlow)" opacity="0.9" />
        <ellipse cx="100" cy="35" rx="15" ry="10" fill="url(#fireGradient)" opacity="0.8" />
        <ellipse cx="100" cy="25" rx="10" ry="8" fill="#fbbf24" opacity="0.7" />
        <ellipse cx="100" cy="18" rx="6" ry="5" fill="#fef3c7" opacity="0.6" />
      </g>

      {/* Side flames */}
      <g className="dragon-fire" opacity="0.7">
        <ellipse cx="55" cy="85" rx="8" ry="5" fill="url(#fireGradient)" transform="rotate(-30 55 85)" />
        <ellipse cx="145" cy="85" rx="8" ry="5" fill="url(#fireGradient)" transform="rotate(30 145 85)" />
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
