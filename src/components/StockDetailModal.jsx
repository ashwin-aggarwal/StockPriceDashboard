import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatPrice, formatPercent } from '../utils/formatters';

const TIME_RANGES = ['1D', '5D', '1M', '6M', '1Y'];

export default function StockDetailModal({ 
  stock, 
  selectedRange, 
  onRangeChange, 
  onClose 
}) {
  if (!stock || !stock.quote) return null;

  const isPositive = stock.quote.dp >= 0;
  
  const chartData = stock.candles?.c?.map((price, idx) => ({
    time: new Date(stock.candles.t[idx] * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(selectedRange === '1D' ? { hour: 'numeric', minute: '2-digit' } : {}),
    }),
    price,
    timestamp: stock.candles.t[idx],
  })) || [];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {stock.profile?.logo && (
              <img src={stock.profile.logo} alt={stock.symbol} className="w-10 h-10 rounded-lg" />
            )}
            <div>
              <h3 className="text-xl font-bold">{stock.symbol}</h3>
              {stock.profile?.name && (
                <p className="text-sm text-slate-400">{stock.profile.name}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price Info */}
          <div className="mb-6">
            <div className="text-4xl font-bold mono mb-2">{formatPrice(stock.quote.c)}</div>
            <div className={`text-lg font-medium ${isPositive ? 'text-green-400' : 'text-red-400'} flex items-center gap-2`}>
              <svg className={`w-4 h-4 ${isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {formatPercent(stock.quote.dp)} ({formatPrice(stock.quote.d)})
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-slate-900/50 rounded-xl">
              <div>
                <div className="text-xs text-slate-400 mb-1">Open</div>
                <div className="font-semibold mono">{formatPrice(stock.quote.o)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">High</div>
                <div className="font-semibold mono">{formatPrice(stock.quote.h)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Low</div>
                <div className="font-semibold mono">{formatPrice(stock.quote.l)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Prev Close</div>
                <div className="font-semibold mono">{formatPrice(stock.quote.pc)}</div>
              </div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => onRangeChange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRange === range
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 ? (
            <div className="bg-slate-900/50 rounded-xl p-4 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (chartData.length > 50) {
                        return value.split(',')[0];
                      }
                      return value;
                    }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#94a3b8', fontSize: 12 }}
                    itemStyle={{ color: '#fff', fontSize: 14 }}
                    formatter={(value) => [formatPrice(value), 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#34d399' : '#f87171'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-slate-900/50 rounded-xl p-4 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400">Loading chart data...</p>
              </div>
            </div>
          )}
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