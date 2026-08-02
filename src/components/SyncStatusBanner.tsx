import React from 'react';
import { useSyncStore } from '../store/useStore';
import { Icon } from './Icon';

/**
 * Veritabanı kuralları her yazma için bir Firebase oturumu şart koşuyor.
 * Barista girişi yalnızca PIN ile yapılıyor, yani cihazda daha önce bir
 * yönetici girişi yapılmamışsa barista kayıtları çevrimdışı kuyrukta birikir
 * ve Firebase'e HİÇ ulaşmaz — üstelik sessizce (bkz. syncEngine.processQueue,
 * hatayı yakalayıp yutuyor). Şubede haftalarca fark edilmeyecek bir veri
 * kaybı olacağı için durumu ekranda görünür kılıyoruz.
 */
export const SyncStatusBanner: React.FC<{ hasSession: boolean }> = ({ hasSession }) => {
  const { isOnline, pendingItemsCount } = useSyncStore();

  const durum = !hasSession
    ? {
        tone: 'border-negative-line bg-negative-bg text-negative' as const,
        icon: 'alert' as const,
        text: 'Cihaz bu şubeye bağlı değil — kayıtlar merkeze gitmiyor. Yönetici girişi yapın.',
      }
    : !isOnline && pendingItemsCount > 0
      ? {
          tone: 'border-caution-line bg-caution-bg text-caution' as const,
          icon: 'alert' as const,
          text: `Çevrimdışısınız. ${pendingItemsCount} kayıt bağlantı gelince gönderilecek.`,
        }
      : null;

  if (!durum) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(80px+env(safe-area-inset-bottom))] z-30 px-4 pointer-events-none">
      <div
        className={`max-w-[560px] mx-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-xl ${durum.tone}`}
      >
        <Icon name={durum.icon} size={15} className="mt-px shrink-0" />
        <span className="text-[12.5px] leading-relaxed">{durum.text}</span>
      </div>
    </div>
  );
};
