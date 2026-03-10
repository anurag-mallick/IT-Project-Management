"use client";
import React from 'react';

const UserManagement = () => {
  return (
    <div className="p-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl mb-1">User Management</h1>
          <p className="text-white/40 text-sm">Create and manage access for IT management team staff.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3 rounded-lg shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-widest">
          Add New User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60 border-b border-white/5 uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 font-medium">Anurag</td>
              <td className="px-6 py-4 text-white/40">anurag_admin</td>
              <td className="px-6 py-4">
                <span className="bg-orange-500/10 text-orange-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter">Admin</span>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-red-400/60 hover:text-red-400 text-xs font-medium transition-colors">Deactivate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
