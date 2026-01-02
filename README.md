# Stock Price Dashboard

A modern, real-time stock price dashboard built with React, TypeScript, and Tailwind CSS. Features live price updates, interactive charts, and a sleek financial terminal aesthetic.

![React](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3+-blue)

## 🚀 Features

### Core Requirements ✅
- **Real-time Stock Data Table** - Display symbol, price, % change with sortable columns
- **Tailwind CSS Styling** - Fully responsive, mobile-friendly design
- **Deployed Application** - Production-ready deployment

### Bonus Features 🎁
- **Interactive Tile-Based Watchlist** - 2×3 grid (stacked on mobile) displaying key metrics
- **Detailed View Modal** - Click any stock to see Open→Current price visualization with axes
- **Ticker Editing with Validation** - Edit any stock symbol with real-time API validation
- **Search & Sorting** - Search by symbol or company name, sort by any column
- **Loading States** - Skeleton loaders and smooth transitions throughout
- **Comprehensive Error Handling** - Graceful fallbacks with retry functionality
- **LocalStorage Persistence** - Your watchlist persists across browser sessions
- **Manual Refresh** - Update all stock data with one click
- **Stale Data Indicators** - See when data was last updated (e.g., "2m ago")
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **React 18+** with Hooks
- **TypeScript** for type safety (TypeScript interfaces used throughout)
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Finnhub API** for real-time stock data
- **Vite** for blazing fast development
- **Vercel** for deployment (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A free Finnhub API key ([Get one here](https://finnhub.io/register))

## 🏃 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stock-dashboard.git
cd stock-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Enter Your API Key

When you first open the app, you'll be prompted to enter your Finnhub API key. The key is stored in your browser's localStorage.

## 📦 Project Structure
```
stock-dashboard/
├── src/
│   ├── main.jsx                 # App entry point
│   ├── index.css                # Global styles & Tailwind imports
│   ├── components/
│   │   ├── StockDashboard.jsx   # Main dashboard component
│   │   ├── ApiKeyInput.jsx      # API key login screen
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── StockGrid.jsx        # Watchlist grid container
│   │   ├── StockTile.jsx        # Individual stock tile
│   │   ├── StockTable.jsx       # Sortable data table
│   │   └── StockDetailModal.jsx # Detail view with chart
│   └── utils/
│       ├── formatters.js        # Price/percent formatting utilities
│       └── api.js               # Finnhub API integration
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

## 🎨 Design Philosophy

The dashboard features a **refined financial terminal aesthetic** with:

- **Typography**: Space Grotesk for headers, JetBrains Mono for numerical data
- **Color Palette**: Deep slate background with cyan/blue accents, green for gains, red for losses
- **Animations**: Smooth micro-interactions and staggered tile reveals
- **Layout**: Grid-based with generous spacing and depth through layering
- **UX**: Clear loading states, helpful error messages, keyboard support (ESC to close modals)

## 🔧 Customization

### Change Default Stocks

Edit `DEFAULT_TICKERS` in `src/components/StockDashboard.jsx`:
```javascript
const DEFAULT_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
```

### Adjust Styling

All colors and styles use Tailwind utility classes. Modify `tailwind.config.js` to customize the theme.

## 📊 API Usage

This app uses the **Finnhub API** with the following endpoints:

- `/quote` - Real-time stock prices and daily statistics
- `/stock/profile2` - Company information and logos

**Rate Limits**: Free tier allows 60 API calls/minute. The app caches data for 1 minute to minimize API usage.

## 🐛 Known Limitations

- **Market Hours**: Live data only available during market hours; shows last close price otherwise
- **Free API Limits**: Limited to 60 calls/minute on free tier
- **Data Delay**: Free tier may have 15-minute delay on some data
- **No Historical Charts**: Free Finnhub tier doesn't support historical candle data (shows Open→Current visualization instead)

## 📝 Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 🚀 Deployment

See deployment instructions in the project documentation. Recommended platform: **Vercel** (auto-detects Vite and deploys in one click).

## 🤝 Contributing

This project was built as a coding challenge. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project for learning or portfolio purposes.

## 👨‍💻 Author

Ashwin Aggarwal
Cornell Engineering Student

## 🙏 Acknowledgments

- [Finnhub](https://finnhub.io) for the free stock API
- [Recharts](https://recharts.org) for React chart components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Vite](https://vitejs.dev) for lightning-fast development
- [Vercel](https://vercel.com) for seamless deployment

---
⭐ If you found this helpful, please consider starring the repo!