import React, { useState, useEffect, useCallback } from 'react';
import ApiKeyInput from './ApiKeyInput';
import Header from './Header';
import StockGrid from './StockGrid';
import StockTable from './StockTable';
import StockDetailModal from './StockDetailModal';
import { fetchQuote, fetchProfile, fetchCandles } from '../utils/api';

const DEFAULT_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];

export default function StockDashboard() {
  const [apiKey, setApiKey] = useState('');
  const [tickers, setTickers] = useState(() => {
    const saved = localStorage.getItem('stockTickers');
    return saved ? JSON.parse(saved) : DEFAULT_TICKERS;
  });
  const [stocksData, setStocksData] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedRange, setSelectedRange] = useState('1D');
  const [editingTicker, setEditingTicker] = useState(null);
  const [newTickerValue, setNewTickerValue] = useState('');
  const [validationState, setValidationState] = useState('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Save tickers to localStorage
  useEffect(() => {
    localStorage.setItem('stockTickers', JSON.stringify(tickers));
  }, [tickers]);

  // Fetch stock data
  const fetchStockData = useCallback(async (symbol, forceRefresh = false) => {
    if (!apiKey) return;

    const existing = stocksData[symbol];
    if (existing && !forceRefresh && Date.now() - existing.lastUpdated < 60000) {
      return;
    }

    setStocksData(prev => ({
      ...prev,
      [symbol]: {
        ...prev[symbol],
        symbol,
        loading: true,
        error: null,
      },
    }));

    try {
      const [quote, profile, candles] = await Promise.all([
        fetchQuote(symbol, apiKey),
        existing?.profile || fetchProfile(symbol, apiKey),
        fetchCandles(symbol, apiKey, selectedRange),
      ]);

      setStocksData(prev => ({
        ...prev,
        [symbol]: {
          symbol,
          quote,
          profile,
          candles,
          loading: false,
          error: quote ? null : 'Failed to load data',
          lastUpdated: Date.now(),
        },
      }));
    } catch (error) {
      setStocksData(prev => ({
        ...prev,
        [symbol]: {
          ...prev[symbol],
          symbol,
          loading: false,
          error: 'Failed to load data',
          lastUpdated: Date.now(),
        },
      }));
    }
  }, [apiKey, selectedRange, stocksData]);

  // Refresh all stocks
  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all(tickers.map(ticker => fetchStockData(ticker, true)));
    setIsRefreshing(false);
  }, [tickers, fetchStockData]);

  // Initial fetch
  useEffect(() => {
    if (apiKey) {
      tickers.forEach(ticker => fetchStockData(ticker));
    }
  }, [apiKey, tickers]);

  // Refetch candles when range changes
  useEffect(() => {
    if (apiKey && selectedStock) {
      fetchCandles(selectedStock, apiKey, selectedRange).then(candles => {
        setStocksData(prev => ({
          ...prev,
          [selectedStock]: {
            ...prev[selectedStock],
            candles,
          },
        }));
      });
    }
  }, [selectedRange, selectedStock, apiKey]);

  // Validate ticker
  const validateTicker = useCallback(async (ticker) => {
    if (!apiKey || !ticker.trim()) {
      setValidationState('idle');
      return false;
    }

    setValidationState('checking');
    const quote = await fetchQuote(ticker.trim().toUpperCase(), apiKey);
    
    if (quote && quote.c > 0) {
      setValidationState('valid');
      return true;
    } else {
      setValidationState('invalid');
      return false;
    }
  }, [apiKey]);

  // Handle ticker edit
  const handleEditTicker = (oldTicker) => {
    setEditingTicker(oldTicker);
    setNewTickerValue(oldTicker);
    setValidationState('idle');
  };

  const handleEditValueChange = (value) => {
    setNewTickerValue(value);
    if (value.trim()) {
      validateTicker(value);
    } else {
      setValidationState('idle');
    }
  };

  const handleSaveTicker = async () => {
    if (validationState !== 'valid' || !editingTicker) return;

    const newTicker = newTickerValue.trim().toUpperCase();
    const newTickers = tickers.map(t => t === editingTicker ? newTicker : t);
    setTickers(newTickers);
    
    await fetchStockData(newTicker);
    
    setEditingTicker(null);
    setNewTickerValue('');
    setValidationState('idle');
  };

  const handleCancelEdit = () => {
    setEditingTicker(null);
    setNewTickerValue('');
    setValidationState('idle');
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Show API key input if not set
  if (!apiKey) {
    return <ApiKeyInput onApiKeySubmit={setApiKey} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <Header onRefresh={handleRefreshAll} isRefreshing={isRefreshing} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <StockGrid
          tickers={tickers}
          stocksData={stocksData}
          onTileClick={setSelectedStock}
          editingTicker={editingTicker}
          newTickerValue={newTickerValue}
          validationState={validationState}
          onEditTicker={handleEditTicker}
          onEditValueChange={handleEditValueChange}
          onSaveTicker={handleSaveTicker}
          onCancelEdit={handleCancelEdit}
        />

        <StockTable
          tickers={tickers}
          stocksData={stocksData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRowClick={setSelectedStock}
        />
      </main>

      {selectedStock && stocksData[selectedStock] && (
        <StockDetailModal
          stock={stocksData[selectedStock]}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}