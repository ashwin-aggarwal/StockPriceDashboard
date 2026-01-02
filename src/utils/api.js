// API utilities
const API_BASE = 'https://finnhub.io/api/v1';

export const fetchQuote = async (symbol, apiKey) => {
  if (!apiKey) return null;
  try {
    const response = await fetch(`${API_BASE}/quote?symbol=${symbol}&token=${apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch quote');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
};

export const fetchProfile = async (symbol, apiKey) => {
  if (!apiKey) return null;
  try {
    const response = await fetch(`${API_BASE}/stock/profile2?symbol=${symbol}&token=${apiKey}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    return null;
  }
};

export const fetchCandles = async (symbol, apiKey, range) => {
  if (!apiKey) return null;
  
  const getRangeParams = (range) => {
    const now = Math.floor(Date.now() / 1000);
    const day = 24 * 60 * 60;
    
    switch (range) {
      case '1D':
        return { from: now - day, to: now, resolution: '5' };
      case '5D':
        return { from: now - 5 * day, to: now, resolution: '30' };
      case '1M':
        return { from: now - 30 * day, to: now, resolution: 'D' };
      case '6M':
        return { from: now - 180 * day, to: now, resolution: 'D' };
      case '1Y':
        return { from: now - 365 * day, to: now, resolution: 'W' };
      default:
        return { from: now - day, to: now, resolution: '5' };
    }
  };
  
  const { from, to, resolution } = getRangeParams(range);
  
  try {
    const response = await fetch(
      `${API_BASE}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`
    );
    if (!response.ok) throw new Error('Failed to fetch candles');
    const data = await response.json();
    return data.s === 'ok' ? data : null;
  } catch (error) {
    console.error(`Error fetching candles for ${symbol}:`, error);
    return null;
  }
};