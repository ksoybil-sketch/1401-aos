import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';

export const DisplayCabinetSummaryCard: React.FC = () => {
  const navigate = useNavigate();
  const { inventory } = useStore();
  const { setInventoryCategoryFilter } = useUIStore();

  const teshirItems = inventory.filter((i) => i.category === 'Teşhir Dolabı');
  if (teshirItems.length === 0) return null;

  const summaryMap: Record<string, number> = {};
  teshirItems.forEach((i) => {
    summaryMap[i.name] = (summaryMap[i.name] || 0) + i.quantity;
  });
  const summaryArray = Object.entries(summaryMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="mt-4 p-[15px] bg-surface-1 rounded-lg border border-surface-border">
      <div className="flex justify-between items-center mb-2.5">
        <h3 className="m-0 text-[15px] text-content">🎂 Dolapta Neler Var?</h3>
        <button
          onClick={() => { setInventoryCategoryFilter('Teşhir Dolabı'); navigate('/inventory'); }}
          className="bg-transparent border-none text-gold text-xs cursor-pointer font-semibold"
        >
          Tümünü Gör
        </button>
      </div>
      <ul className="list-none p-0 m-0">
        {summaryArray.map((item) => (
          <li key={item.name} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
            <span className="text-content-muted">{item.name}</span>
            <span className="font-bold text-content">{item.quantity} Adet</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FrozenStockSummaryCard: React.FC = () => {
  const navigate = useNavigate();
  const { frozenStock } = useStore();

  if (frozenStock.length === 0) return null;

  const sorted = [...frozenStock].sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="mt-4 p-[15px] bg-surface-1 rounded-lg border border-surface-border">
      <div className="flex justify-between items-center mb-2.5">
        <h3 className="m-0 text-[15px] text-content">🧀 Stokta Ne Var?</h3>
        <button
          onClick={() => navigate('/frozen-stock')}
          className="bg-transparent border-none text-gold text-xs cursor-pointer font-semibold"
        >
          Tümünü Gör
        </button>
      </div>
      <ul className="list-none p-0 m-0">
        {sorted.slice(0, 6).map((item) => (
          <li key={item.id} className="flex justify-between py-2 border-b border-surface-border text-sm last:border-b-0">
            <span className="text-content-muted">{item.name}</span>
            <span className={`font-bold ${item.quantity === 0 ? 'text-danger' : 'text-gold'}`}>
              {item.quantity === 0 ? 'Tükendi!' : `${item.quantity} Adet`}
            </span>
          </li>
        ))}
      </ul>
      {sorted.length > 6 && (
        <p className="mt-2 mb-0 text-xs text-content-muted text-center">
          +{sorted.length - 6} ürün daha...
        </p>
      )}
    </div>
  );
};
