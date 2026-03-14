"use client";
import React, { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import ListBoard from '@/components/ListBoard';
import dynamic from 'next/dynamic';

const ReportsView = dynamic(() => import('@/components/ReportsView'), { ssr: false });
const CalendarView = dynamic(() => import('@/components/CalendarView'), { ssr: false });
const IntelligenceDashboard = dynamic(() => import('@/components/IntelligenceDashboard'), { ssr: false });
import Sidebar from '@/components/DashboardSidebar';
import AuthGuard from '@/components/AuthGuard';
import NavHeader from '@/components/NavHeader';
import NewTicketModal from '@/components/NewTicketModal';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'kanban' | 'list' | 'reports' | 'calendar' | 'intelligence'>('intelligence');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [staff, setStaff] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetch('/api/users').then(res => res.ok && res.json()).then(data => { if(data) setStaff(data) }).catch(console.error);
    fetch('/api/assets').then(res => res.ok && res.json()).then(data => { if(data) setAssets(data) }).catch(console.error);
  }, []);

  const handleTicketCreated = () => setRefreshKey(k => k + 1);

  return (
    <AuthGuard>
      <div className="flex bg-zinc-950 min-h-screen text-white overflow-hidden">
        <Sidebar 
          activeView={activeView as any} 
          setActiveView={setActiveView as any} 
          onNewTicket={() => setIsModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          <NavHeader 
            activeView={activeView as any} 
            setActiveView={setActiveView as any} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <div className="p-8 max-w-7xl mx-auto w-full">
            {activeView === 'kanban' && <KanbanBoard searchQuery={debouncedSearchQuery} users={staff} assets={assets} />}
            {activeView === 'list' && <ListBoard key={`${refreshKey}`} searchQuery={debouncedSearchQuery} users={staff} assets={assets} />}
            {activeView === 'reports' && <ReportsView />}
            {activeView === 'intelligence' && <IntelligenceDashboard />}
            {activeView === 'calendar' && <CalendarView key={refreshKey} users={staff} assets={assets} />}
          </div>
        </main>
      </div>

      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleTicketCreated} 
      />
    </AuthGuard>
  );
};

export default Dashboard;
