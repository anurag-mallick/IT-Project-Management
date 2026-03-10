"use client";
import React, { useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import ListBoard from '@/components/ListBoard';
import ReportsView from '@/components/ReportsView';
import Sidebar from '@/components/DashboardSidebar';
import AuthGuard from '@/components/AuthGuard';
import NavHeader from '@/components/NavHeader';
import NewTicketModal from '@/components/NewTicketModal';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'kanban' | 'list' | 'reports'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex bg-zinc-950 min-h-screen text-white overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          <NavHeader activeView={activeView} setActiveView={setActiveView} />
          
          <div className="p-8 max-w-7xl mx-auto w-full">
            {activeView === 'kanban' && <KanbanBoard />}
            {activeView === 'list' && <ListBoard />}
            {activeView === 'reports' && <ReportsView />}
          </div>
        </main>
      </div>

      <NewTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </AuthGuard>
  );
};

export default Dashboard;
