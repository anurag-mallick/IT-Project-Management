"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, Filter } from 'lucide-react';

const ListBoard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm">No tickets found</td>
            </tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-white/30">#{ticket.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{ticket.title}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase ${
                    ticket.priority === 'URGENT' ? 'text-red-400' :
                    ticket.priority === 'HIGH' ? 'text-orange-400' :
                    'text-indigo-400'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-white/30">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListBoard;
