// Finnhub API utilities
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