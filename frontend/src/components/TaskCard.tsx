"use client";
import React from 'react';
import { MoreHorizontal, MessageSquare, Paperclip, CheckSquare, Clock } from 'lucide-react';

interface TaskCardProps {
  ticket: any;
  onDragStart: (e: React.DragEvent) => void;
}

const TaskCard = ({ ticket, onDragStart }: TaskCardProps) => {
  const isUrgent = ticket.priority === 'URGENT';
  const isHigh = ticket.priority === 'HIGH';

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className="bg-zinc-900 border border-white/5 rounded-xl p-4 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing group animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* Card Header: Priority & ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <span className={`text-[9px] font-black tracking-tighter uppercase px-1.5 py-0.5 rounded ${
            isUrgent ? 'bg-red-500/20 text-red-500' :
            isHigh ? 'bg-orange-500/20 text-orange-500' :
            'bg-indigo-500/20 text-indigo-400'
          }`}>
            {ticket.priority}
          </span>
          <span className="text-[9px] text-white/20 font-mono tracking-tighter mt-0.5">#{ticket.id}</span>
        </div>
        <MoreHorizontal size={14} className="text-white/10 group-hover:text-white/40 transition-colors" />
      </div>

      {/* Card Body: Title & Tags */}
      <h4 className="text-xs font-semibold text-white/90 leading-relaxed mb-3 group-hover:text-white transition-colors">
        {ticket.title}
      </h4>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="bg-white/5 border border-white/5 text-[9px] px-1.5 py-0.5 rounded text-white/40">Infrastructure</span>
        <span className="bg-white/5 border border-white/5 text-[9px] px-1.5 py-0.5 rounded text-white/40">Critical Fix</span>
      </div>

      {/* Card Footer: Metadata & Assignee */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white/20">
          <div className="flex items-center gap-1">
            <MessageSquare size={12} />
            <span className="text-[10px]">{ticket.comments?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckSquare size={12} />
            <span className="text-[10px]">0/4</span>
          </div>
          {ticket.slaBreachAt && (
             <div className="flex items-center gap-1 text-red-500/50">
               <Clock size={12} />
               <span className="text-[10px]">2h</span>
             </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-zinc-900 flex items-center justify-center text-[8px] font-bold">
            {ticket.assignedTo?.name?.[0] || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
