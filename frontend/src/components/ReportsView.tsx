"use client";
import React from 'react';

const ReportsView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="glass-card p-6">
        <h4 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">Total Tickets</h4>
        <div className="text-3xl font-bold">124</div>
        <div className="mt-2 text-green-400 text-xs text-bold">↑ 12% vs last week</div>
      </div>
      <div className="glass-card p-6">
        <h4 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">SLA Compliance</h4>
        <div className="text-3xl font-bold">94.2%</div>
        <div className="mt-2 text-red-400 text-xs text-bold">↓ 2% vs last week</div>
      </div>
      <div className="glass-card p-6">
        <h4 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">Avg. Resolution Time</h4>
        <div className="text-3xl font-bold">4.2h</div>
        <div className="mt-2 text-white/20 text-xs text-bold">Stable performance</div>
      </div>
      <div className="glass-card p-6 border-indigo-500/20 bg-indigo-500/5">
        <h4 className="text-indigo-400/60 text-[10px] uppercase tracking-widest font-bold mb-4">Active Staff</h4>
        <div className="text-3xl font-bold text-indigo-400">8</div>
        <div className="mt-2 text-indigo-400/40 text-xs text-bold">Real-time status</div>
      </div>

      <div className="lg:col-span-3 glass-card p-6 min-h-[400px] flex items-center justify-center border-dashed border-white/5">
         <span className="text-white/20 text-sm">Ticket Volume Graph (Connect Chart.js soon)</span>
      </div>

      <div className="glass-card p-6">
         <h4 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">SLA at Risk</h4>
         <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/40">#12{i}</span>
                <span className="text-xs text-red-400 font-bold">22m left</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ReportsView;
