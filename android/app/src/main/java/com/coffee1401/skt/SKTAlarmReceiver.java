package com.coffee1401.skt;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

/**
 * AlarmManager tarafından 09:00 ve 17:00'da tetiklenen BroadcastReceiver.
 * SharedPreferences'tan envanter verilerini okur ve kritik ürünler varsa bildirim gönderir.
 * Uygulama tamamen kapalıyken bile çalışır.
 */
public class SKTAlarmReceiver extends BroadcastReceiver {

    public static final String ACTION_MORNING = "com.coffee1401.skt.ALARM_MORNING";
    public static final String ACTION_EVENING = "com.coffee1401.skt.ALARM_EVENING";
    public static final String PREFS_NAME = "skt_native_prefs";
    public static final String KEY_INVENTORY = "skt_inventory_json";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        boolean isMorning = ACTION_MORNING.equals(action);
        int notifId = isMorning
                ? NotificationHelper.NOTIFICATION_ID_MORNING
                : NotificationHelper.NOTIFICATION_ID_EVENING;

        // SharedPreferences'tan envanter JSON'ını oku
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String inventoryJson = prefs.getString(KEY_INVENTORY, "[]");

        // Kritik ürünleri analiz et
        InventoryAnalysis analysis = analyzeInventory(inventoryJson);

        if (!analysis.hasAlert) {
            // Kritik ürün yoksa bildirim gönderme
            return;
        }

        String timeLabel = isMorning ? "Sabah Kontrolü ☕" : "Akşam Kontrolü 🌙";
        String title = analysis.hasExpired
                ? "🚨 Kritik SKT Uyarısı! | " + timeLabel
                : "⚠️ Yaklaşan SKT | " + timeLabel;

        NotificationHelper.sendNotification(context, title, analysis.body, notifId);

        // Bir sonraki günün alarmını yeniden kur (AlarmManager tekrar etmeyebilir)
        NotificationScheduler.scheduleAlarms(context);
    }

    /**
     * JSON envanter verisini analiz eder, son kullanma tarihine göre kritik ürünleri bulur.
     */
    private InventoryAnalysis analyzeInventory(String jsonStr) {
        InventoryAnalysis result = new InventoryAnalysis();
        List<String> expired = new ArrayList<>();
        List<String> warning = new ArrayList<>();

        try {
            JSONArray items = new JSONArray(jsonStr);
            Date today = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            String todayStr = sdf.format(today);

            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);
                String name = item.optString("name", "Bilinmeyen Ürün");
                String expDateStr = item.optString("expirationDate", "");

                if (expDateStr.isEmpty()) continue;

                long daysRemaining = getDaysRemaining(expDateStr, sdf, today);

                if (daysRemaining <= 0) {
                    expired.add(name);
                } else if (daysRemaining <= 3) {
                    warning.add(name);
                }
            }
        } catch (Exception e) {
            // JSON parse hatası - sessizce devam et
        }

        if (expired.isEmpty() && warning.isEmpty()) {
            result.hasAlert = false;
            return result;
        }

        result.hasAlert = true;
        result.hasExpired = !expired.isEmpty();

        List<String> parts = new ArrayList<>();

        if (!expired.isEmpty()) {
            if (expired.size() == 1) {
                parts.add("\"" + expired.get(0) + "\" ürününün SKT'si geçti!");
            } else if (expired.size() <= 3) {
                parts.add("\"" + joinList(expired, ", ") + "\" ürünlerinin SKT'si geçti!");
            } else {
                parts.add("\"" + joinList(expired.subList(0, 3), ", ") + "\" ve " + (expired.size() - 3) + " ürünün SKT'si geçti!");
            }
        }

        if (!warning.isEmpty()) {
            if (warning.size() == 1) {
                parts.add("\"" + warning.get(0) + "\" ürününün SKT'si dolmak üzere!");
            } else if (warning.size() <= 3) {
                parts.add("\"" + joinList(warning, " ve ") + "\" ürünlerinin SKT'si dolmak üzere!");
            } else {
                parts.add("\"" + joinList(warning.subList(0, 3), ", ") + "\" ve " + (warning.size() - 3) + " ürünün SKT'si dolmak üzere!");
            }
        }

        result.body = joinList(parts, " | ");
        return result;
    }

    private long getDaysRemaining(String dateStr, SimpleDateFormat sdf, Date today) {
        try {
            Date expDate = sdf.parse(dateStr);
            if (expDate == null) return 99;
            long diffMs = expDate.getTime() - today.getTime();
            return TimeUnit.MILLISECONDS.toDays(diffMs);
        } catch (Exception e) {
            return 99;
        }
    }

    private String joinList(List<String> list, String separator) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(separator);
            sb.append(list.get(i));
        }
        return sb.toString();
    }

    static class InventoryAnalysis {
        boolean hasAlert = false;
        boolean hasExpired = false;
        String body = "";
    }
}
