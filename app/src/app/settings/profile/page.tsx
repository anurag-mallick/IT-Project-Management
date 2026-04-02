"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    name: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/users/profile');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }
            const data = await res.json();
            setProfile(data);
            setName(data.name || '');
            setEmail(data.email);
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        // Validate password change
        if (newPassword) {
            if (!currentPassword) {
                setError('Current password is required to change password');
                setSaving(false);
                return;
            }
            if (newPassword !== confirmPassword) {
                setError('New passwords do not match');
                setSaving(false);
                return;
            }
            if (newPassword.length < 6) {
                setError('New password must be at least 6 characters');
                setSaving(false);
                return;
            }
        }

        try {
            const body: any = { name, email };
            if (newPassword) {
                body.currentPassword = currentPassword;
                body.newPassword = newPassword;
            }

            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Refresh profile data
            await fetchProfile();
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Header */}
            <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-zinc-950/20 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <h1 className="text-lg font-bold text-white">Profile Settings</h1>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Profile Info Card */}
                {profile && (
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <User size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{profile.name || profile.username}</h2>
                                <p className="text-white/40 text-sm">@{profile.username}</p>
                                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${profile.role === 'ADMIN'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                    }`}>
                                    {profile.role}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-white/40">Member since</span>
                                <p className="text-white font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-white/40">Last updated</span>
                                <p className="text-white font-medium">{new Date(profile.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                                        placeholder="Your name"
                                    />
                                </div>
                            </div>

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
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-2">Change Password</h3>
                        <p className="text-white/40 text-sm mb-6">Leave blank to keep current password</p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Current Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Confirm New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-white/10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                            <AlertCircle className="text-red-500 shrink-0" size={16} />
                            <p className="text-xs text-red-500 font-bold">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                            <CheckCircle className="text-green-500 shrink-0" size={16} />
                            <p className="text-xs text-green-500 font-bold">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 uppercase tracking-widest text-xs"
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}