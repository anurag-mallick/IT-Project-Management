"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, AlertCircle, CheckCircle, Bell, Monitor, Globe, Layout } from 'lucide-react';

interface UserPreferences {
    emailNotifications: boolean;
    desktopNotifications: boolean;
    theme: 'dark' | 'light' | 'system';
    language: string;
    timezone: string;
    compactMode: boolean;
    showCompletedTickets: boolean;
    defaultView: string;
}

export default function PreferencesPage() {
    const [preferences, setPreferences] = useState<UserPreferences>({
        emailNotifications: true,
        desktopNotifications: true,
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        compactMode: false,
        showCompletedTickets: true,
        defaultView: 'intelligence',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const res = await fetch('/api/users/preferences');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch preferences');
            }
            const data = await res.json();
            setPreferences(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/users/preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update preferences');
            }

            setSuccess('Preferences updated successfully');
        } catch (err: any) {
            setError(err.message || 'Failed to update preferences');
        } finally {
            setSaving(false);
        }
    };

    const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
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
                    <h1 className="text-lg font-bold text-white">Preferences</h1>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Notifications */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Bell size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Notifications</h3>
                                <p className="text-white/40 text-sm">Manage how you receive notifications</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <div>
                                    <span className="text-white font-medium text-sm">Email Notifications</span>
                                    <p className="text-white/40 text-xs">Receive ticket updates via email</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => updatePreference('emailNotifications', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/5 focus:ring-offset-0"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <div>
                                    <span className="text-white font-medium text-sm">Desktop Notifications</span>
                                    <p className="text-white/40 text-xs">Show browser notifications for updates</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.desktopNotifications}
                                    onChange={(e) => updatePreference('desktopNotifications', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/5 focus:ring-offset-0"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Monitor size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Appearance</h3>
                                <p className="text-white/40 text-sm">Customize the look and feel</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Theme</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['dark', 'light', 'system'].map((theme) => (
                                        <button
                                            key={theme}
                                            type="button"
                                            onClick={() => updatePreference('theme', theme as 'dark' | 'light' | 'system')}
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${preferences.theme === theme
                                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <div>
                                    <span className="text-white font-medium text-sm">Compact Mode</span>
                                    <p className="text-white/40 text-xs">Reduce spacing for denser layouts</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.compactMode}
                                    onChange={(e) => updatePreference('compactMode', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/5 focus:ring-offset-0"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Regional */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Globe size={20} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Regional</h3>
                                <p className="text-white/40 text-sm">Language and timezone settings</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Language</label>
                                <select
                                    value={preferences.language}
                                    onChange={(e) => updatePreference('language', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="ja">日本語</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Timezone</label>
                                <select
                                    value={preferences.timezone}
                                    onChange={(e) => updatePreference('timezone', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                    <option value="Asia/Kolkata">Kolkata</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* View Settings */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <Layout size={20} className="text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">View Settings</h3>
                                <p className="text-white/40 text-sm">Customize your default views</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Default View</label>
                                <select
                                    value={preferences.defaultView}
                                    onChange={(e) => updatePreference('defaultView', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                >
                                    <option value="intelligence">Intelligence Dashboard</option>
                                    <option value="kanban">Board View</option>
                                    <option value="list">List View</option>
                                    <option value="calendar">Calendar View</option>
                                    <option value="sla">SLA Monitor</option>
                                    <option value="reports">Reports</option>
                                </select>
                            </div>

                            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <div>
                                    <span className="text-white font-medium text-sm">Show Completed Tickets</span>
                                    <p className="text-white/40 text-xs">Display resolved and closed tickets</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.showCompletedTickets}
                                    onChange={(e) => updatePreference('showCompletedTickets', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/5 focus:ring-offset-0"
                                />
                            </label>
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
                                Save Preferences
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}