"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import TaskCard from './TaskCard';
import TicketDetailModal from '@/components/TicketDetailModal';
import { Ticket, TicketStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const stages: { id: TicketStatus; name: string }[] = [
    { id: 'TODO', name: 'To Do' },
    { id: 'IN_PROGRESS', name: 'In Progress' },
    { id: 'AWAITING_USER', name: 'Awaiting User' },
    { id: 'RESOLVED', name: 'Resolved' },
    { id: 'CLOSED', name: 'Closed' }
  ];

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Connection error');
      console.error('Audit Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const moveTicket = async (ticketId: number, newStatus: TicketStatus) => {
    // Optimistic Update
    const originalTickets = [...tickets];
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`http://localhost:4000/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update ticket status');
      fetchTickets();
    } catch (err) {
      setTickets(originalTickets); // Revert on failure
      console.error('Move Error:', err);
    }
  };

  if (isLoading && tickets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="glass-card p-6 flex items-center gap-4 text-red-400">
          <AlertCircle />
          <span>{error}. Please check if the backend is running.</span>
          <button onClick={fetchTickets} className="text-indigo-400 font-bold hover:underline ml-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
      {stages.map(stage => (
        <div 
          key={stage.id} 
          className="kanban-column"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const ticketId = parseInt(e.dataTransfer.getData('ticketId'));
            moveTicket(ticketId, stage.id);
          }}
        >
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-sm text-white/60">{stage.name}</h3>
            <span className="bg-white/5 text-[10px] px-2 py-0.5 rounded-full border border-white/10 uppercase font-bold tracking-wider">
              {tickets.filter(t => t.status === stage.id).length}
            </span>
          </div>
          
          <div className="space-y-4 min-h-[500px]">
            <AnimatePresence>
              {tickets.filter(t => t.status === stage.id).map((ticket) => (
                <motion.div 
                  key={ticket.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <TaskCard 
                    ticket={ticket} 
                    onDragStart={(e: React.DragEvent) => e.dataTransfer.setData('ticketId', ticket.id.toString())}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      <TicketDetailModal 
        isOpen={!!selectedTicket} 
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={fetchTickets}
      />
    </div>
  );
};

export default KanbanBoard;
