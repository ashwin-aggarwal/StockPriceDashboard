// Formatting utilities
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPercent = (percent) => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

export const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const getRangeParams = (range) => {
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