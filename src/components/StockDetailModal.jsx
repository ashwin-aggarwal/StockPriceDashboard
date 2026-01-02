import React from 'react';
import { formatPrice, formatPercent } from '../utils/formatters';

export default function StockDetailModal({ 
  stock, 
  onClose 
}) {
  if (!stock || !stock.quote) return null;

  const isPositive = stock.quote.dp >= 0;
  const changeAmount = stock.quote.d;

  // Calculate position for current price on the chart
  const range = stock.quote.h - stock.quote.l;
  const openPosition = ((stock.quote.o - stock.quote.l) / range) * 100;
  const currentPosition = ((stock.quote.c - stock.quote.l) / range) * 100;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {stock.profile?.logo && (
              <img src={stock.profile.logo} alt={stock.symbol} className="w-10 h-10 rounded-lg" />
            )}
            <div>
              <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
              {stock.profile?.name && (
                <p className="text-sm text-slate-400">{stock.profile.name}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Price - Large Display */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mono mb-3 text-white">{formatPrice(stock.quote.c)}</div>
            <div className={`text-2xl font-medium ${isPositive ? 'text-green-400' : 'text-red-400'} flex items-center justify-center gap-2`}>
              <svg className={`w-6 h-6 ${isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>{formatPercent(stock.quote.dp)} ({isPositive ? '+' : ''}{formatPrice(Math.abs(changeAmount))})</span>
            </div>
          </div>

          {/* Simple Open → Current Chart */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-4">Today's Price Movement</h4>
            
            {/* Chart Area */}
            <div className="relative h-64 bg-slate-800/50 rounded-lg p-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 pr-2">
                <span>{formatPrice(stock.quote.h)}</span>
                <span>{formatPrice((stock.quote.h + stock.quote.l) / 2)}</span>
                <span>{formatPrice(stock.quote.l)}</span>
              </div>

              {/* Chart content */}
              <div className="ml-16 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-t border-slate-700/50"></div>
                  <div className="border-t border-slate-700/50"></div>
                  <div className="border-t border-slate-700/50"></div>
                </div>

                {/* Line connecting Open to Current */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="100%" stopColor={isPositive ? '#34d399' : '#f87171'} />
                    </linearGradient>
                  </defs>
                  <line
                    x1="10%"
                    y1={`${100 - openPosition}%`}
                    x2="90%"
                    y2={`${100 - currentPosition}%`}
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Open circle */}
                  <circle
                    cx="10%"
                    cy={`${100 - openPosition}%`}
                    r="6"
                    fill="#64748b"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  
                  {/* Current circle */}
                  <circle
                    cx="90%"
                    cy={`${100 - currentPosition}%`}
                    r="6"
                    fill={isPositive ? '#34d399' : '#f87171'}
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 mt-2">
                  <div className="text-center" style={{ position: 'absolute', left: '10%', transform: 'translateX(-50%)', bottom: '-24px' }}>
                    <div className="font-medium">Open</div>
                    <div className="text-slate-500">{formatPrice(stock.quote.o)}</div>
                  </div>
                  <div className="text-center" style={{ position: 'absolute', left: '90%', transform: 'translateX(-50%)', bottom: '-24px' }}>
                    <div className="font-medium">Current</div>
                    <div className={isPositive ? 'text-green-400' : 'text-red-400'}>{formatPrice(stock.quote.c)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-2">Open</div>
              <div className="text-2xl font-bold mono text-white">{formatPrice(stock.quote.o)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-2">Previous Close</div>
              <div className="text-2xl font-bold mono text-white">{formatPrice(stock.quote.pc)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-2">Day High</div>
              <div className="text-2xl font-bold mono text-green-400">{formatPrice(stock.quote.h)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <div className="text-sm text-slate-400 mb-2">Day Low</div>
              <div className="text-2xl font-bold mono text-red-400">{formatPrice(stock.quote.l)}</div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400 mb-1">Today's Performance</h4>
                <p className="text-sm text-slate-400">
                  {stock.symbol} opened at {formatPrice(stock.quote.o)} and is currently trading at {formatPrice(stock.quote.c)}.
                  Stock is {isPositive ? 'up' : 'down'} {formatPercent(Math.abs(stock.quote.dp))} from yesterday's close.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}