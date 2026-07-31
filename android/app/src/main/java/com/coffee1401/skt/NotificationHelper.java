package com.coffee1401.skt;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;

/**
 * SKT Takip uygulaması için bildirim yardımcısı.
 * Bildirim kanalını oluşturur ve kritik ürün bildirimlerini gönderir.
 */
public class NotificationHelper {

    public static final String CHANNEL_ID = "skt_critical_channel";
    public static final String CHANNEL_NAME = "SKT Kritik Uyarılar";
    public static final String CHANNEL_DESC = "Son kullanma tarihi geçmiş veya yaklaşan ürünler için bildirimler";
    public static final int NOTIFICATION_ID_MORNING = 1001;
    public static final int NOTIFICATION_ID_EVENING = 1002;

    /**
     * Android 8+ için bildirim kanalını oluşturur.
     */
    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription(CHANNEL_DESC);
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 300, 100, 300});
            channel.enableLights(true);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

            NotificationManager manager = context.getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * Kritik SKT bildirimi gönder.
     *
     * @param context   Android context
     * @param title     Bildirim başlığı
     * @param body      Bildirim içeriği
     * @param notifId   Bildirim ID (sabah/akşam ayrımı için)
     */
    public static void sendNotification(Context context, String title, String body, int notifId) {
        createNotificationChannel(context);

        // Bildirime tıklanınca uygulamayı aç
        Intent launchIntent = context.getPackageManager()
                .getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent != null) {
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                notifId,
                launchIntent != null ? launchIntent : new Intent(),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setVibrate(new long[]{0, 300, 100, 300});

        NotificationManager manager = (NotificationManager)
                context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(notifId, builder.build());
        }
    }
}
