package com.coffee1401.skt;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.util.Calendar;

/**
 * AlarmManager ile 09:00 ve 17:00 günlük alarmlarını kurar.
 * AlarmManager.RTC_WAKEUP kullanıldığı için telefon uyku modunda olsa bile çalışır.
 */
public class NotificationScheduler {

    private static final String TAG = "NotificationScheduler";

    public static final int REQUEST_CODE_MORNING = 2001;
    public static final int REQUEST_CODE_EVENING = 2002;

    /**
     * Her gün 09:00 ve 17:00 için alarmları kur.
     * Eğer o saat bugün için geçmişse, yarın için ayarla.
     */
    public static void scheduleAlarms(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        scheduleAlarm(context, alarmManager, 9, 0,
                SKTAlarmReceiver.ACTION_MORNING, REQUEST_CODE_MORNING);

        scheduleAlarm(context, alarmManager, 17, 0,
                SKTAlarmReceiver.ACTION_EVENING, REQUEST_CODE_EVENING);

        Log.d(TAG, "SKT alarmları kuruldu: 09:00 ve 17:00");
    }

    private static void scheduleAlarm(Context context, AlarmManager alarmManager,
                                       int hour, int minute, String action, int requestCode) {
        Intent intent = new Intent(context, SKTAlarmReceiver.class);
        intent.setAction(action);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // Hedef saati hesapla
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        // Geçmiş saatse yarına ayarla
        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
        }

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                // Android 12+ - canScheduleExactAlarms kontrolü
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                            AlarmManager.RTC_WAKEUP,
                            calendar.getTimeInMillis(),
                            pendingIntent
                    );
                } else {
                    // Kesin alarm izni yoksa yaklaşık alarm kullan
                    alarmManager.setAndAllowWhileIdle(
                            AlarmManager.RTC_WAKEUP,
                            calendar.getTimeInMillis(),
                            pendingIntent
                    );
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                );
            } else {
                alarmManager.setExact(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                );
            }

            Log.d(TAG, "Alarm kuruldu: " + hour + ":" + String.format("%02d", minute)
                    + " -> " + calendar.getTime().toString());

        } catch (SecurityException e) {
            Log.e(TAG, "Alarm kurma izni reddedildi: " + e.getMessage());
        }
    }

    /**
     * Tüm alarmları iptal et.
     */
    public static void cancelAlarms(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent morningIntent = new Intent(context, SKTAlarmReceiver.class);
        morningIntent.setAction(SKTAlarmReceiver.ACTION_MORNING);
        PendingIntent morningPending = PendingIntent.getBroadcast(context, REQUEST_CODE_MORNING,
                morningIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        alarmManager.cancel(morningPending);

        Intent eveningIntent = new Intent(context, SKTAlarmReceiver.class);
        eveningIntent.setAction(SKTAlarmReceiver.ACTION_EVENING);
        PendingIntent eveningPending = PendingIntent.getBroadcast(context, REQUEST_CODE_EVENING,
                eveningIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        alarmManager.cancel(eveningPending);

        Log.d(TAG, "SKT alarmları iptal edildi.");
    }
}
