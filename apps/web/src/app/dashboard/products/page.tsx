'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { erpEngine } from '@/lib/erp-engine';
import {
  ShoppingBag,
  Plus,
  Search,
  DollarSign,
  PieChart,
  CheckCircle2,
  RefreshCw,
  X,
  TrendingUp,
  Boxes,
  Star,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';

export interface ExtendedProduct {
  id: string;
  asin: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  allocatedBudget: number;
  spentBudget: number;
  stockQuantity: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  status: 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export const INITIAL_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'prod_101',
    asin: 'B08N5WRWNW',
    sku: 'HW-SRV-2U-BLD',
    name: 'Enterprise Cloud Server Rack 2U (64-Core AMD EPYC)',
    description: 'Pre-configured high density server for local cloud AI & database execution.',
    category: 'Hardware & Infrastructure',
    price: 4899.00,
    costPrice: 2800.00,
    allocatedBudget: 50000.00,
    spentBudget: 33600.00,
    stockQuantity: 18,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 128,
    status: 'ACTIVE',
  },
  {
    id: 'prod_102',
    asin: 'B09V3KXJPB',
    sku: 'HW-WRK-ULTRA',
    name: 'Developer Workstation Station Ultra i9 / 128GB RAM',
    description: 'Engineered for CAD design, local compile pipelines, and deep learning models.',
    category: 'Hardware & Infrastructure',
    price: 3299.00,
    costPrice: 1950.00,
    allocatedBudget: 35000.00,
    spentBudget: 23400.00,
    stockQuantity: 12,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 94,
    status: 'ACTIVE',
  },
  {
    id: 'prod_103',
    asin: 'B07XJW8123',
    sku: 'SW-ERP-ENTERPRISE',
    name: 'ERP SaaS Enterprise Workspace (1-Year Core License)',
    description: 'Full workspace access with high-availability cluster SLA and 24/7 engineering support.',
    category: 'Software & Licenses',
    price: 8999.00,
    costPrice: 1200.00,
    allocatedBudget: 20000.00,
    spentBudget: 4800.00,
    stockQuantity: 999,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 312,
    status: 'ACTIVE',
  },
  {
    id: 'prod_104',
    asin: 'B0B8QX2911',
    sku: 'IOT-SENS-IND',
    name: 'Industrial IoT Sensor Pack (Telemetry & Vibration)',
    description: 'Wireless Zigbee/LoRaWAN factory floor metrics telemetry sensor kit.',
    category: 'IoT & Automation',
    price: 850.00,
    costPrice: 410.00,
    allocatedBudget: 15000.00,
    spentBudget: 9840.00,
    stockQuantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewsCount: 42,
    status: 'LOW_STOCK',
  },
  {
    id: 'prod_105',
    asin: 'B08L5WH39K',
    sku: 'LOG-SCN-WIRELESS',
    name: 'Ruggedized Warehouse Barcode Scanner 2D',
    description: 'IP67 rated logistics handheld scanner with direct ERP SAP/NetSuite sync API.',
    category: 'Logistics Hardware',
    price: 450.00,
    costPrice: 210.00,
    allocatedBudget: 12000.00,
    spentBudget: 7350.00,
    stockQuantity: 35,
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 88,
    status: 'ACTIVE',
  },
  {
    id: 'prod_106',
    asin: 'B09G9FPHP6',
    sku: 'SVC-ARCH-100H',
    name: 'ERP Onsite Architecture Consulting (100-Hour Block)',
    description: 'Dedicated enterprise solutions engineers for custom DB migration and integration.',
    category: 'Professional Services',
    price: 12500.00,
    costPrice: 5000.00,
    allocatedBudget: 40000.00,
    spentBudget: 15000.00,
    stockQuantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 19,
    status: 'ACTIVE',
  },
];

export default function AdminProductsPage() {
  const { tenantId } = useAuth();
  const [products, setProducts] = useState<ExtendedProduct[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    asin: 'B0' + Math.floor(10000000 + Math.random() * 90000000),
    sku: 'PROD-' + Math.floor(100 + Math.random() * 900),
    name: '',
    description: '',
    category: 'Hardware & Infrastructure',
    price: 1299.00,
    costPrice: 650.00,
    allocatedBudget: 25000.00,
    stockQuantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  });

  const totalCatalogBudget = products.reduce((acc, p) => acc + p.allocatedBudget, 0);
  const totalBudgetSpent = products.reduce((acc, p) => acc + p.spentBudget, 0);
  const totalRevenuePotential = products.reduce((acc, p) => acc + p.price * p.stockQuantity, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: ExtendedProduct = {
      id: `prod_${Date.now()}`,
      ...formData,
      spentBudget: formData.costPrice * formData.stockQuantity,
      rating: 5.0,
      reviewsCount: 1,
      status: formData.stockQuantity < 10 ? 'LOW_STOCK' : 'ACTIVE',
    };

    setProducts([newProd, ...products]);
    setShowModal(false);
    setFeedback(`Product "${newProd.name}" added with allocated budget $${newProd.allocatedBudget.toLocaleString()}!`);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.asin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 uppercase">
              Amazon-Vendor ERP Mode
            </span>
            <span className="text-xs text-slate-500">Tenant: <strong className="text-slate-200">{tenantId}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Catalog, ASIN & Product Budget Hub</h1>
          <p className="text-xs text-slate-400">Manage sourcing budgets, unit margins, and Amazon ASIN inventory listings.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="h-4 w-4" /> Add Product & Sourcing Budget
        </button>
      </div>

      {feedback && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Budget & Catalog Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Sourcing Budget</span>
            <PieChart className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">${totalCatalogBudget.toLocaleString()}</h3>
          <p className="text-xs text-emerald-400 mt-1">${totalBudgetSpent.toLocaleString()} Budget Employed</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Stock Inventory Value</span>
            <Boxes className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">${totalRevenuePotential.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 mt-1">{products.length} Active Catalog ASINs</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Avg Profit Margin</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400 mt-2">
            {(
              (products.reduce((acc, p) => acc + ((p.price - p.costPrice) / p.price) * 100, 0) / products.length).toFixed(1)
            )}%
          </h3>
          <p className="text-xs text-slate-500 mt-1">Weighted product gross margin</p>
        </div>
      </div>

      {/* Product & Budget Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title, ASIN, SKU, or Category..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">Showing {filtered.length} products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">ASIN / SKU</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price & Margin</th>
                <th className="px-4 py-3.5">Allocated Budget</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((p) => {
                const margin = (((p.price - p.costPrice) / p.price) * 100).toFixed(0);
                const budgetUsedPct = ((p.spentBudget / p.allocatedBudget) * 100).toFixed(0);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-11 w-11 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-950"
                        />
                        <div>
                          <p className="font-bold text-white text-xs hover:text-blue-400 cursor-pointer">{p.name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                            <Star className="h-3 w-3 fill-amber-400" />
                            <span>{p.rating}</span>
                            <span className="text-slate-500">({p.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <div className="text-amber-400 font-semibold">{p.asin}</div>
                      <div className="text-slate-500">{p.sku}</div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                        <Tag className="h-3 w-3 text-slate-500" /> {p.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <div className="font-bold text-emerald-400">${p.price.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Cost: ${p.costPrice} ({margin}% Margin)</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <div className="text-white">${p.allocatedBudget.toLocaleString()}</div>
                      <div className="w-24 bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-800">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, Number(budgetUsedPct))}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{budgetUsedPct}% budget utilized</div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-white">{p.stockQuantity}</td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        ● {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">New Product & Budget Entry</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">ASIN Identifier</label>
                  <input
                    type="text"
                    required
                    value={formData.asin}
                    onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Amazon Logistics Smart Fleet Tracker 4G"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                  >
                    <option>Hardware & Infrastructure</option>
                    <option>Software & Licenses</option>
                    <option>IoT & Automation</option>
                    <option>Logistics Hardware</option>
                    <option>Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Allocated Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.allocatedBudget}
                    onChange={(e) => setFormData({ ...formData, allocatedBudget: Number(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Save Product to ERP</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
