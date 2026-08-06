import React from 'react';
import { Icon } from './Icon';

interface UpdateBannerProps {
  latestVersion: string;
  note?: string;
  onDismiss: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ latestVersion, note, onDismiss }) => {
  return (
    <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+68px)] z-40 px-4 [animation:fadeSlideIn_0.25s_ease-out]">
      <div className="max-w-[560px] mx-auto flex items-start gap-2.5 rounded-xl border border-caution-line bg-espresso/95 backdrop-blur-xl px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <span className="w-7 h-7 shrink-0 rounded-lg bg-caution-bg text-caution flex items-center justify-center">
          <Icon name="download" size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-caution uppercase tracking-wide">
            Yeni sürüm var — {latestVersion}
          </div>
          <div className="text-[13.5px] text-crema leading-relaxed mt-0.5">
            {note || 'Güncel APK dosyasını şube müdürünüzden veya merkezden isteyip yükleyin.'}
          </div>
        </div>
        <button onClick={onDismiss} className="shrink-0 text-fg-3 hover:text-crema p-0.5" aria-label="Kapat">
          <Icon name="close" size={15} />
        </button>
      </div>
    </div>
  );
};
