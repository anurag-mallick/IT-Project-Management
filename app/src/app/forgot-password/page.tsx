"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12h16" className="text-white" />
                            <path d="M8 8l-4 4 4 4" className="text-white" />
                            <path d="M16 8l4 4-4 4" className="text-white" />
                            <circle cx="12" cy="6" r="2" fill="currentColor" className="text-white" />
                            <circle cx="12" cy="18" r="2" fill="currentColor" className="text-white" />
                            <circle cx="8" cy="12" r="1.5" fill="currentColor" className="text-white opacity-70" />
                            <circle cx="16" cy="12" r="1.5" fill="currentColor" className="text-white opacity-70" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">HORIZON<span className="text-blue-500">IT</span></span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-5xl font-black text-white leading-tight mb-6">
                        Reset Your <br /> <span className="text-blue-500">Password.</span>
                    </h1>
                    <p className="text-white/40 text-lg leading-relaxed">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-white/40 text-xs">1</span>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-white/40 text-xs">2</span>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-white/40 text-xs">3</span>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="space-y-2">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-4"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </Link>
                        <h2 className="text-2xl font-bold text-white">Forgot password?</h2>
                        <p className="text-white/40 text-sm font-medium">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                <CheckCircle className="text-green-500 shrink-0" size={20} />
                                <div>
                                    <p className="text-sm text-green-500 font-bold">Check your email</p>
                                    <p className="text-xs text-green-500/70 mt-1">
                                        We've sent a password reset link to {email}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/login"
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Email</label>
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

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="text-red-500 shrink-0" size={16} />
                                    <p className="text-xs text-red-500 font-bold">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 uppercase tracking-widest text-xs"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}