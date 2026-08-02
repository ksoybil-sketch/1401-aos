import React, { useEffect } from 'react';
import { BroadcastMessage } from '../types';
import { Icon } from './Icon';

const AUTO_DISMISS_MS = 8000;

export const BroadcastBanner: React.FC<{ broadcast: BroadcastMessage | null; onDismiss: () => void }> = ({
  broadcast,
  onDismiss
}) => {
  useEffect(() => {
    if (!broadcast) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [broadcast, onDismiss]);

  if (!broadcast) return null;

  return (
    <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4px)] z-50 px-4 [animation:fadeSlideIn_0.25s_ease-out]">
      <div className="max-w-[560px] mx-auto flex items-start gap-2.5 rounded-xl border border-accent-line bg-espresso/95 backdrop-blur-xl px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <span className="w-7 h-7 shrink-0 rounded-lg bg-accent-bg text-accent flex items-center justify-center">
          <Icon name="bell" size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-accent uppercase tracking-wide">Duyuru</div>
          <div className="text-[13.5px] text-crema leading-relaxed mt-0.5">{broadcast.message}</div>
        </div>
        <button onClick={onDismiss} className="shrink-0 text-fg-3 hover:text-crema p-0.5" aria-label="Kapat">
          <Icon name="close" size={15} />
        </button>
      </div>
    </div>
  );
};
