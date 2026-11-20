'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { erpEngine } from '@/lib/erp-engine';
import { INITIAL_PRODUCTS, ExtendedProduct } from '@/app/dashboard/products/page';
import {
  ShoppingCart,
  CheckCircle2,
  Star,
  ShieldCheck,
  Truck,
  Zap,
  Search,
  Box,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerStorePage() {
  const { tenantId, user } = useAuth();
  const [products] = useState<ExtendedProduct[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastOrder, setLastOrder] = useState<{
    orderId: string;
    productName: string;
    price: number;
    timestamp: string;
  } | null>(null);

  const categories = ['ALL', 'Hardware & Infrastructure', 'Software & Licenses', 'IoT & Automation', 'Logistics Hardware', 'Professional Services'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.asin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBuyNow = (product: ExtendedProduct) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Real-time cascade across ERP DB
    erpEngine.processCustomerSale(orderId, product.price, 1);

    setLastOrder({
      orderId,
      productName: product.name,
      price: product.price,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Amazon Business Style Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-amber-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 text-[10px] uppercase border border-amber-500/30">
                Amazon Business Portal Sync
              </span>
              <span className="text-xs text-slate-400">Client: <strong className="text-white">{tenantId}</strong></span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Enterprise Hardware & Solution Store</h1>
            <p className="text-xs text-slate-400">Direct vendor catalog linked with live ERP stock & billing engines.</p>
          </div>

          <Link
            href="/dashboard/workflow"
            className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all self-start sm:self-auto"
          >
            <Zap className="h-4 w-4" /> View Live ERP Real-Time Sync <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Amazon ASIN, product title, hardware specs..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Callout */}
      {lastOrder && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Amazon Business Order Placed! ({lastOrder.orderId})</h3>
                <p className="text-xs text-emerald-300">
                  Item: <strong>{lastOrder.productName}</strong> for <strong>${lastOrder.price.toLocaleString()}</strong> at {lastOrder.timestamp}
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              ERP Event Triggered
            </span>
          </div>
        </div>
      )}

      {/* Amazon Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl group"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur font-mono text-[10px] text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                ASIN: {p.asin}
              </span>
              <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                In Stock ({p.stockQuantity})
              </span>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">{p.category}</span>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-xs text-amber-400 pt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-white">{p.rating}</span>
                  <span className="text-slate-500 text-[11px]">({p.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Price & Buy Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Enterprise Unit Price</span>
                  <span className="text-xl font-black text-white">${p.price.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleBuyNow(p)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:opacity-90 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
