import { Capacitor } from '@capacitor/core';
import { InventoryItem } from '../types';

/**
 * Android'de v22'den kalan InventoryBridge eklentisine köprü. Native taraf
 * (SKTAlarmReceiver) SharedPreferences'tan okuyup 08:00/17:00'de tarihi geçen
 * ve 3 gün içinde geçecek ürünler için bildirim gönderiyor — uygulama tamamen
 * kapalıyken bile. Bu yüzden envanter her değiştiğinde burayı güncel tutmak
 * gerekiyor; aksi halde bildirimler günler öncesinin verisiyle çalışır.
 */
export const syncInventoryToNative = async (inventory: InventoryItem[]): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const plugin = (Capacitor as unknown as { Plugins?: Record<string, any> }).Plugins?.InventoryBridge;
    if (!plugin) return;
    await plugin.saveInventory({ json: JSON.stringify(inventory) });
  } catch {
    // Bildirim altyapısı olmadan da uygulama çalışmaya devam etmeli.
  }
};
