"use client";

import { useState, useEffect } from "react";
import NavHeader from "@/components/NavHeader";
import { Laptop, Monitor, Server, Plus, Search, Edit2, Trash2, Box } from "lucide-react";

interface User {
  id: number;
  name: string | null;
  username: string;
}

interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  description: string | null;
  assignedTo: User | null;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("LAPTOP");
  const [status, setStatus] = useState("ACTIVE");
  const [description, setDescription] = useState("");

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/assets");
      const data = await res.json();
      if (res.ok) {
        setAssets(data);
      }
    } catch (error) {
      console.error("Failed to load assets", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, status, description }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchAssets();
        // Reset form
        setName("");
        setDescription("");
      }
    } catch (error) {
      console.error("Failed to create asset", error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "LAPTOP": return <Laptop className="w-5 h-5 text-blue-400" />;
      case "DESKTOP": return <Monitor className="w-5 h-5 text-purple-400" />;
      case "SERVER": return <Server className="w-5 h-5 text-amber-400" />;
      default: return <Box className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200">
      <NavHeader activeView="kanban" setActiveView={() => {}} />
      
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Server className="w-8 h-8 text-blue-500" />
              IT Asset Management
            </h1>
            <p className="text-slate-400 mt-2">Track hardware, software, and physical inventory.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        </div>

        {/* Search */}
        <div className="bg-slate-800/80 border border-slate-700 p-2 rounded-2xl flex items-center gap-3 mb-6 relative z-10 w-full max-w-md">
           <Search className="w-5 h-5 text-slate-400 ml-2" />
           <input
             type="text"
             placeholder="Search assets..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="bg-transparent border-none text-white focus:outline-none w-full placeholder:text-slate-500"
           />
        </div>

        {/* Assets Table */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading assets...</td>
                  </tr>
                ) : filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                      <Box className="w-12 h-12 text-slate-600 mb-3" />
                      <p>No assets found in inventory.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-700/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                            {getIconForType(asset.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{asset.name}</div>
                            {asset.description && <div className="text-xs text-slate-400 mt-1 line-clamp-1">{asset.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          asset.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                          asset.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {asset.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                              {asset.assignedTo.name?.[0] || asset.assignedTo.username[0]}
                            </div>
                            <span className="text-sm text-slate-300">{asset.assignedTo.name || asset.assignedTo.username}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-500" />
                Add New Asset
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Asset Name / Tag</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                  placeholder="e.g. MacBook Pro M3 (#1042)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors appearance-none"
                  >
                    <option value="LAPTOP">Laptop</option>
                    <option value="DESKTOP">Desktop</option>
                    <option value="MONITOR">Monitor</option>
                    <option value="SERVER">Server</option>
                    <option value="SOFTWARE">Software License</option>
                    <option value="PERIPHERAL">Peripheral</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors appearance-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="MAINTENANCE">In Maintenance</option>
                    <option value="RETIRED">Retired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description / Serial Number</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors min-h-[100px] resize-none"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors border border-slate-700 hover:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
