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
    <div style={{ marginTop: '16px', padding: '15px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>🎂 Dolapta Neler Var?</h3>
        <button
          onClick={() => { setInventoryCategoryFilter('Teşhir Dolabı'); navigate('/inventory'); }}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
        >
          Tümünü Gör
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {summaryArray.map((item) => (
          <li key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.quantity} Adet</span>
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
    <div style={{ marginTop: '16px', padding: '15px', backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)' }}>🧀 Stokta Ne Var?</h3>
        <button
          onClick={() => navigate('/frozen-stock')}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
        >
          Tümünü Gör
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sorted.slice(0, 6).map((item) => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface-border)', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
            <span style={{ fontWeight: 700, color: item.quantity === 0 ? 'var(--danger)' : 'var(--accent)' }}>
              {item.quantity === 0 ? 'Tükendi!' : `${item.quantity} Adet`}
            </span>
          </li>
        ))}
      </ul>
      {sorted.length > 6 && (
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          +{sorted.length - 6} ürün daha...
        </p>
      )}
    </div>
  );
};
