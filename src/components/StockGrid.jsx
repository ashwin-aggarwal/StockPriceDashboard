import React from 'react';
import StockTile from './StockTile';

export default function StockGrid({ 
  tickers, 
  stocksData, 
  onTileClick, 
  editingTicker,
  newTickerValue,
  validationState,
  onEditTicker,
  onEditValueChange,
  onSaveTicker,
  onCancelEdit
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickers.map((ticker) => {
          const stock = stocksData[ticker];
          const isEditing = editingTicker === ticker;

          return (
            <StockTile
              key={ticker}
              stock={stock}
              onTileClick={() => onTileClick(ticker)}
              onEdit={() => onEditTicker(ticker)}
              isEditing={isEditing}
              editValue={newTickerValue}
              onEditValueChange={onEditValueChange}
              validationState={validationState}
              onSave={onSaveTicker}
              onCancel={onCancelEdit}
            />
          );
        })}
      </div>
    </section>
  );
}