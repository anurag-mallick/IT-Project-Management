"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutGrid, List, BarChart, Users, LogOut, Settings, 
  ChevronDown, ChevronRight, Hash, Shield, Database, 
  Plus, Search, Star, Home, Bell, Inbox, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: 'kanban' | 'list' | 'reports') => void;
  onNewTicket: () => void;
}

const Sidebar = ({ activeView, setActiveView, onNewTicket }: SidebarProps) => {
  const { user, logout } = useAuth();
  const [spacesOpen, setSpacesOpen] = useState(true);

  const spaces = [
    { id: 'it', name: 'IT Operations', color: 'bg-indigo-500', icon: Shield },
    { id: 'assets', name: 'Asset Management', color: 'bg-emerald-500', icon: Database },
    { id: 'support', name: 'Service Desk', color: 'bg-orange-500', icon: Inbox },
  ];

  return (
    <aside className="w-[280px] bg-zinc-950/50 border-r border-white/5 flex flex-col h-screen backdrop-blur-3xl">
      {/* Workspace Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-500/20">
            AM
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none">Anurag's Workspace</span>
            <span className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Free Plan</span>
          </div>
        </div>
        <ChevronDown size={14} className="text-white/40" />
      </div>

      {/* Primary Navigation */}
      <div className="p-2 space-y-0.5 mt-2">
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
          <Search size={16} />
          <span>Search</span>
        </button>
        <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-3">
            <Home size={16} />
            <span>Home</span>
          </div>
        </button>
        <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <Inbox size={16} />
            <span>Inbox</span>
          </div>
          <span className="text-[10px] bg-indigo-600 px-1.5 py-0.5 rounded-full font-bold">2</span>
        </button>
        
        <button 
          onClick={onNewTicket}
          className="w-full flex items-center gap-3 px-3 py-2 mt-4 mb-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Favorites */}
      <div className="px-5 mt-6 mb-2">
        <div className="text-[10px] uppercase font-bold tracking-widest text-white/20 flex items-center justify-between">
          <span>Favorites</span>
          <Star size={10} />
        </div>
      </div>
      <div className="px-2 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <Hash size={14} className="text-emerald-500" />
          <span>Ticket Queue</span>
        </button>
        
        {user?.role === 'ADMIN' && (
          <a 
            href="/admin/users"
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Users size={14} className="text-purple-500" />
            <span>User Management</span>
          </a>
        )}
      </div>

      {/* Spaces Hierarchy */}
      <div className="px-2 mt-6 flex-1 overflow-y-auto custom-scrollbar">
        <button 
          onClick={() => setSpacesOpen(!spacesOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            {spacesOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <span>Spaces</span>
          </div>
          <Plus size={12} className="opacity-0 group-hover:opacity-100" />
        </button>

        <AnimatePresence initial={false}>
          {spacesOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-1 space-y-1"
            >
              {spaces.map(space => (
                <div key={space.id} className="space-y-0.5">
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer group">
                    <ChevronRight size={12} className="text-white/20" />
                    <div className={`w-2 h-2 rounded-sm ${space.color}`} />
                    <span className="flex-1">{space.name}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs text-indigo-400">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold">{user?.name || 'Local User'}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-tighter">Pro member</span>
          </div>
        </div>
        <button onClick={logout} className="text-white/20 hover:text-red-400 transition-colors">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
