import React from 'react';
import { formatPrice, formatPercent, getTimeAgo } from '../utils/formatters';

export default function StockTable({ 
  tickers, 
  stocksData, 
  searchTerm, 
  onSearchChange, 
  sortConfig, 
  onSort, 
  onRowClick 
}) {
  const getSortedAndFilteredStocks = () => {
  let filtered = tickers
    .map(ticker => stocksData[ticker])
    .filter(stock => stock && stock.quote)
    .filter(stock => 
      searchTerm === '' || 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortConfig.key) {
          case 'symbol':
            aVal = a.symbol;
            bVal = b.symbol;
            break;
          case 'price':
            aVal = a.quote.c;
            bVal = b.quote.c;
            break;
          case 'change':
            aVal = a.quote.dp;
            bVal = b.quote.dp;
            break;
          case 'updated':
            aVal = a.lastUpdated;
            bVal = b.lastUpdated;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const stocks = getSortedAndFilteredStocks();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Stocks </h2>
        {/* <h3 className="text-xl">Click to sort </h3> */}
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th
                  className="text-left px-6 py-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSort('symbol')}
                >
                  <div className="flex items-center gap-2">
                    Symbol
                    {sortConfig?.key === 'symbol' && (
                      <svg className={`w-4 h-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSort('price')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Price
                    {sortConfig?.key === 'price' && (
                      <svg className={`w-4 h-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSort('change')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Change
                    {sortConfig?.key === 'change' && (
                      <svg className={`w-4 h-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="text-right px-6 py-4 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSort('updated')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Last Updated
                    {sortConfig?.key === 'updated' && (
                      <svg className={`w-4 h-4 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const isPositive = stock.quote.dp >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors cursor-pointer"
                    onClick={() => onRowClick(stock.symbol)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {stock.profile?.logo && (
                          <img src={stock.profile.logo} alt={stock.symbol} className="w-8 h-8 rounded" />
                        )}
                        <div>
                          <div className="font-semibold">{stock.symbol}</div>
                          {stock.profile?.name && (
                            <div className="text-xs text-slate-400">{stock.profile.name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right mono font-semibold">
                      {formatPrice(stock.quote.c)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                        isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        <svg className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium mono">{formatPercent(stock.quote.dp)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-400">
                      {getTimeAgo(stock.lastUpdated)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {stocks.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-400">No stocks found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>
    </section>
  );
}