'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import { Package, Plus, Search, AlertCircle, RefreshCw, X, CheckCircle2 } from 'lucide-react';

interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unitPrice: number;
}

const MOCK_ITEMS: Item[] = [
  { id: '1', sku: 'SKU-SER-01', name: 'Enterprise Rack Server 2U', category: 'Hardware', quantity: 14, minThreshold: 5, unitPrice: 2400.0 },
  { id: '2', sku: 'SKU-CAB-88', name: 'Cat6 Shielded Patch Cable 10m', category: 'Networking', quantity: 3, minThreshold: 10, unitPrice: 18.5 },
  { id: '3', sku: 'SKU-MON-27', name: '4K IPS Developer Monitor 27"', category: 'Peripherals', quantity: 28, minThreshold: 8, unitPrice: 420.0 },
];

export default function InventoryPage() {
  const { tenantId } = useAuth();
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sku: 'SKU-NEW-01',
    name: '',
    category: 'Hardware',
    quantity: 10,
    minThreshold: 5,
    unitPrice: 100,
  });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/inventory/items');
      if (res.data && Array.isArray(res.data)) setItems(res.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Item = { id: String(Date.now()), ...formData };
    try {
      await apiClient.post('/inventory/items', formData);
      setFeedback('Item added to Inventory database.');
    } catch {
      setFeedback('Item added (Dev Mode).');
    }
    setItems([newItem, ...items]);
    setShowModal(false);
  };

  const updateQuantity = async (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
    try {
      await apiClient.patch(`/inventory/items/${id}/stock`, { delta });
    } catch {
      // Offline fallback
    }
  };

  const lowStockCount = items.filter((i) => i.quantity <= i.minThreshold).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory & Stock Tracking</h1>
          <p className="text-sm text-slate-400 mt-1">Tenant: <span className="text-blue-400 font-semibold">{tenantId}</span> | Warehouse Management</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" /> Add Item / SKU
        </button>
      </div>

      {feedback && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /><span>{feedback}</span></div>
          <button onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <span className="text-xs text-slate-400">Total Tracked SKUs</span>
          <h2 className="text-2xl font-bold text-white mt-2">{items.length}</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <span className="text-xs text-slate-400">Low Stock Alerts</span>
          <h2 className="text-2xl font-bold text-amber-400 mt-2">{lowStockCount} Items</h2>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <span className="text-xs text-slate-400">Inventory Valuation</span>
          <h2 className="text-2xl font-bold text-emerald-400 mt-2">
            ${items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU or item name..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 pl-9 pr-4 text-xs text-white focus:outline-none"
            />
          </div>
          <button onClick={fetchItems} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">SKU Code</th>
                <th className="px-6 py-3.5">Item Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Unit Price</th>
                <th className="px-6 py-3.5">In Stock</th>
                <th className="px-6 py-3.5">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono text-blue-400">{item.sku}</td>
                  <td className="px-6 py-4 font-semibold text-white">{item.name}</td>
                  <td className="px-6 py-4 text-slate-400">{item.category}</td>
                  <td className="px-6 py-4 font-mono">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 font-bold ${
                        item.quantity <= item.minThreshold ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {item.quantity <= item.minThreshold && <AlertCircle className="h-3.5 w-3.5" />}
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="rounded bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="rounded bg-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-700"
                      >
                        +1
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Inventory Item</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">SKU</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
