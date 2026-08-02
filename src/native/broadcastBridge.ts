import { Capacitor } from '@capacitor/core';

/**
 * InventoryBridge'deki showNotification metoduna köprü — Bölge Müdürü'nün
 * gönderdiği duyuruyu bu cihazda sistem bildirimi olarak gösterir.
 *
 * Bu, süreç canlıyken (ön planda ya da yakın zamanda arka plana alınmışken)
 * çalışır. Uygulaması tamamen kapatılmış bir cihaza ulaşmaz — bunun için
 * Firebase Cloud Messaging + bir Cloud Function (Blaze plan) gerekir.
 */
export const showLocalNotification = async (title: string, body: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const plugin = (Capacitor as unknown as { Plugins?: Record<string, any> }).Plugins?.InventoryBridge;
    if (!plugin) return;
    await plugin.showNotification({ title, body });
  } catch {
    // Bildirim gönderilemezse de duyuru uygulama içinde banner olarak görünür.
  }
};
