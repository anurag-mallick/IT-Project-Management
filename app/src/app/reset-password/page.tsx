"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
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
                        Create New <br /> <span className="text-blue-500">Password.</span>
                    </h1>
                    <p className="text-white/40 text-lg leading-relaxed">
                        Choose a strong password for your account. Make sure it's at least 6 characters long.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-blue-500" />
                    </div>
                    <div className="flex-1 h-px bg-blue-500/30" />
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CheckCircle size={16} className="text-blue-500" />
                    </div>
                    <div className="flex-1 h-px bg-blue-500/30" />
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Set new password</h2>
                        <p className="text-white/40 text-sm font-medium">
                            Your new password must be different from previously used passwords.
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                                <CheckCircle className="text-green-500 shrink-0" size={20} />
                                <div>
                                    <p className="text-sm text-green-500 font-bold">Password reset successful!</p>
                                    <p className="text-xs text-green-500/70 mt-1">
                                        Redirecting to login page...
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                disabled={loading || !token}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 uppercase tracking-widest text-xs"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Reset Password'
                                )}
                            </button>

                            <Link
                                href="/login"
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Back to login
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}