package com.coffee1401.skt;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * Cihaz yeniden başladığında alarmları yeniden kurar.
 * Android, reboot sonrasında tüm AlarmManager alarmlarını sıfırlar.
 * Bu receiver BOOT_COMPLETED olayını dinleyerek alarmları geri yükler.
 */
public class BootReceiver extends BroadcastReceiver {

    private static final String TAG = "BootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();

        if (Intent.ACTION_BOOT_COMPLETED.equals(action)
                || "android.intent.action.LOCKED_BOOT_COMPLETED".equals(action)) {

            Log.d(TAG, "Cihaz yeniden başlatıldı. SKT alarmları yeniden kuruluyor...");

            // Bildirim kanalını oluştur
            NotificationHelper.createNotificationChannel(context);

            // 08:00 ve 17:00 alarmlarını yeniden kur
            NotificationScheduler.scheduleAlarms(context);

            Log.d(TAG, "SKT alarmları başarıyla yeniden kuruldu.");
        }
    }
}
