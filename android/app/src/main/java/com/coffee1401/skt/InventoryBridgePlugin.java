package com.coffee1401.skt;

import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Capacitor JavaScript → Android Native köprüsü.
 * Web tarafından envanter JSON'ını alır ve SKTAlarmReceiver'ın
 * okuyabileceği SharedPreferences'a kaydeder.
 *
 * Kullanım (app.js'de):
 *   window.Capacitor.Plugins.InventoryBridge.saveInventory({ json: JSON.stringify(arr) })
 */
@CapacitorPlugin(name = "InventoryBridge")
public class InventoryBridgePlugin extends Plugin {

    @PluginMethod
    public void saveInventory(PluginCall call) {
        String json = call.getString("json", "[]");

        SharedPreferences prefs = getContext().getSharedPreferences(
                SKTAlarmReceiver.PREFS_NAME, android.content.Context.MODE_PRIVATE);
        prefs.edit()
                .putString(SKTAlarmReceiver.KEY_INVENTORY, json)
                .apply();

        JSObject result = new JSObject();
        result.put("success", true);
        result.put("count", countItems(json));
        call.resolve(result);
    }

    @PluginMethod
    public void getInventory(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(
                SKTAlarmReceiver.PREFS_NAME, android.content.Context.MODE_PRIVATE);
        String json = prefs.getString(SKTAlarmReceiver.KEY_INVENTORY, "[]");

        JSObject result = new JSObject();
        result.put("json", json);
        call.resolve(result);
    }

    /**
     * Bölge Müdürü'nün gönderdiği bir duyuruyu bu cihazda anında sistem
     * bildirimi olarak gösterir. NotificationHelper zaten mevcut kanalı ve
     * izinleri kullanıyor — ayrı bir eklentiye gerek yok.
     *
     * Not: bu, uygulama süreci canlıyken (ön planda ya da yakın zamanda
     * arka plana alınmışken) çalışır. Tamamen kapatılmış/kaydırılmış bir
     * cihaza ulaşmak için gerçek push altyapısı (FCM) gerekir.
     */
    @PluginMethod
    public void showNotification(PluginCall call) {
        String title = call.getString("title", "1401 Coffee");
        String body = call.getString("body", "");

        NotificationHelper.sendNotification(getContext(), title, body,
                NotificationHelper.NOTIFICATION_ID_BROADCAST);

        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    private int countItems(String json) {
        try {
            return new org.json.JSONArray(json).length();
        } catch (Exception e) {
            return 0;
        }
    }
}
