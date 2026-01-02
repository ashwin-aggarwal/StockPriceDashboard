import React from 'react';
import { formatPrice, formatPercent, getTimeAgo } from '../utils/formatters';

export default function StockTile({ 
  stock, 
  onTileClick, 
  onEdit, 
  isEditing, 
  editValue, 
  onEditValueChange, 
  validationState, 
  onSave, 
  onCancel 
}) {
  if (!stock) return null;

  const isPositive = stock.quote && stock.quote.dp >= 0;

  return (
    <div className="stock-tile bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden hover:border-slate-600/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all hover:-translate-y-1">
      <div className="bg-noise absolute inset-0 pointer-events-none" />
      
      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onEdit();
          }}
          className="absolute top-4 right-4 w-7 h-7 bg-slate-700/50 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all z-20"
          title="Edit ticker"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      {isEditing ? (
        <div className="relative z-10 space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-2">New Ticker Symbol</label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., AAPL"
              autoFocus
            />
          </div>

          {validationState !== 'idle' && (
            <div className="flex items-center gap-2 text-xs">
              {validationState === 'checking' && (
                <>
                  <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-400">Checking...</span>
                </>
              )}
              {validationState === 'valid' && (
                <>
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-500">Valid ticker</span>
                </>
              )}
              {validationState === 'invalid' && (
                <>
                  <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-500">Invalid ticker</span>
                </>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={validationState !== 'valid'}
              className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm font-medium transition-all"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : stock.loading ? (
        <div className="relative z-10 flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading...</p>
          </div>
        </div>
      ) : stock.error ? (
        <div className="relative z-10 flex flex-col items-center justify-center h-32 gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-red-400">Failed to load</p>
        </div>
      ) : stock.quote ? (
        <div 
          className="relative z-10 cursor-pointer" 
          onClick={(e) => {
            if (e.target.closest('button')) return;
            onTileClick();
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold">{stock.symbol}</h3>
                {stock.profile?.logo && (
                  <img src={stock.profile.logo} alt={stock.symbol} className="w-5 h-5 rounded" />
                )}
              </div>
              {stock.profile?.name && (
                <p className="text-xs text-slate-400 line-clamp-1">{stock.profile.name}</p>
              )}
            </div>
          </div>

          {/* Price Section - Larger and centered */}
          <div className="mb-4 text-center py-6">
            <div className="text-3xl font-bold mono mb-2">{formatPrice(stock.quote.c)}</div>
            <div className={`text-lg font-medium ${isPositive ? 'text-green-400' : 'text-red-400'} flex items-center justify-center gap-2`}>
              <svg className={`w-5 h-5 ${isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {formatPercent(stock.quote.dp)}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">High</div>
              <div className="text-sm font-semibold mono">{formatPrice(stock.quote.h)}</div>
            </div>
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Low</div>
              <div className="text-sm font-semibold mono">{formatPrice(stock.quote.l)}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
            <span>{getTimeAgo(stock.lastUpdated)}</span>
            <span className="text-cyan-400 font-medium">View chart →</span>
          </div>
        </div>
      ) : null}

      <style>{`
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        .stock-tile {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}