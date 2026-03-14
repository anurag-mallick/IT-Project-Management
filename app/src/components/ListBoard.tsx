"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, Loader2, AlertCircle, List, ArrowUpDown } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Ticket } from '@/types';
import TicketDetailModal from '@/components/TicketDetailModal';

const priorityColor: Record<string, string> = {
  P0: 'text-red-400',
  P1: 'text-orange-400',
  P2: 'text-indigo-400',
  P3: 'text-zinc-400',
};

const PRIORITY_LABELS: Record<string, string> = {
  P0: 'P0 – Critical', P1: 'P1 – High', P2: 'P2 – Normal', P3: 'P3 – Low',
};

const statusColors: Record<string, string> = {
  TODO:          'bg-zinc-700/50 text-zinc-300',
  IN_PROGRESS:   'bg-blue-500/15 text-blue-300',
  AWAITING_USER: 'bg-yellow-500/15 text-yellow-300',
  RESOLVED:      'bg-green-500/15 text-green-300',
  CLOSED:        'bg-zinc-600/30 text-zinc-400',
};

interface ListBoardProps {
  searchQuery?: string;
  users?: User[];
  assets?: any[];
}

const ListBoard = ({ searchQuery = "", users, assets }: ListBoardProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { supabaseUser } = useAuth();

  const fetchTickets = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets?page=${page}&pageSize=20`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data.tickets);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(pagination.page); }, [pagination.page]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    // Safety check for all fields used in search
    const title = t.title || "";
    const description = t.description || "";
    const requester = t.requesterName || t.authorName || "";
    const id = t.id?.toString() || "";

    return (
      title.toLowerCase().includes(q) ||
      description.toLowerCase().includes(q) ||
      requester.toLowerCase().includes(q) ||
      id.includes(q)
    );
  });

  const rowVirtualizer = useVirtualizer({
    count: filteredTickets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  if (loading) return (
    <div className="flex-1 flex items-center justify-center py-24">
      <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="glass-card p-6 flex items-center gap-3 text-red-400">
      <AlertCircle size={18} />
      <span className="text-sm">{error}</span>
      <button onClick={() => fetchTickets(1)} className="ml-auto text-indigo-400 hover:underline text-xs font-bold">Retry</button>
    </div>
  );

  return (
    <>
      <div className="glass-card overflow-hidden flex flex-col h-[700px]">
        {/* Table Header */}
        <div className="flex border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold">
          <div className="w-16 px-6 py-4 flex-shrink-0">ID</div>
          <div className="flex-1 px-6 py-4 min-w-0">Title</div>
          <div className="w-32 px-6 py-4 flex-shrink-0">Status</div>
          <div className="w-32 px-6 py-4 flex-shrink-0">Priority</div>
          <div className="w-40 px-6 py-4 flex-shrink-0">Requester</div>
          <div className="w-32 px-6 py-4 flex-shrink-0">Created</div>
          <div className="w-12 px-6 py-4 flex-shrink-0"></div>
        </div>

        {/* virtualized Scroll Container */}
        <div 
          ref={parentRef} 
          className="flex-1 overflow-auto scrollbar-hide"
          style={{ contain: 'strict' }}
        >
          {filteredTickets.length === 0 ? (
            <div className="flex items-center justify-center p-24 text-white/20 text-sm">No tickets found</div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const ticket = filteredTickets[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    className="absolute top-0 left-0 w-full flex items-center hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="w-16 px-6 py-4 h-full flex items-center font-mono text-xs text-white/30 flex-shrink-0">
                      #{ticket.id}
                    </div>
                    <div className="flex-1 px-6 py-4 h-full flex items-center text-sm font-medium overflow-hidden">
                      <span className="truncate">{ticket.title}</span>
                    </div>
                    <div className="w-32 px-6 py-4 h-full flex items-center flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${statusColors[ticket.status] ?? 'bg-white/5 text-white/50'}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="w-32 px-6 py-4 h-full flex items-center flex-shrink-0">
                      <span className={`text-[10px] font-bold ${priorityColor[ticket.priority] ?? 'text-white/40'}`}>
                        {PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                      </span>
                    </div>
                    <div className="w-40 px-6 py-4 h-full flex items-center text-xs text-white/40 flex-shrink-0">
                      <span className="truncate">{ticket.requesterName || ticket.authorName || '—'}</span>
                    </div>
                    <div className="w-32 px-6 py-4 h-full flex items-center text-xs text-white/30 flex-shrink-0">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    <div className="w-12 px-6 py-4 h-full flex items-center justify-end flex-shrink-0">
                      <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 px-2">
        <div className="text-xs text-white/40 font-medium">
          Showing <span className="text-white/70">{tickets.length}</span> of <span className="text-white/70">{pagination.totalCount}</span> tickets
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={pagination.page <= 1}
            onClick={() => fetchTickets(pagination.page - 1)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-xl border border-white/5 text-xs font-bold transition-all"
          >
            Prev
          </button>
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-4">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <button 
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchTickets(pagination.page + 1)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-xl border border-white/5 text-xs font-bold transition-all"
          >
            Next
          </button>
        </div>
      </div>

      <TicketDetailModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={() => fetchTickets(pagination.page)}
        users={users}
        assets={assets}
      />
    </>
  );
};

export default ListBoard;
